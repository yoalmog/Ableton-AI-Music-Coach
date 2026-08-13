import express, { Request, Response } from 'express';
import { dbStore } from './dbStore.js';

export const paymentRouter = express.Router();

function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const session = dbStore.getSession(token);
  if (!session) return null;

  return dbStore.getUserById(session.userId);
}

// CREATE CHECKOUT SESSION
paymentRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const { plan, currency } = req.body || {};

    if (!plan || (plan !== 'pro_monthly' && plan !== 'pro_yearly')) {
      return res.status(400).json({ ok: false, error: 'Invalid subscription plan.' });
    }

    const userId = user ? user.userId : `guest_${Date.now()}`;
    const userEmail = user ? user.email : 'guest@aamc.local';

    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (stripeSecret && stripeSecret !== 'MY_STRIPE_SECRET_KEY') {
      try {
        // Dynamic Stripe Import if key present
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24' as any });

        const priceId = plan === 'pro_yearly'
          ? (process.env.STRIPE_PRICE_ID_PRO_YEARLY || 'price_pro_yearly_aamc')
          : (process.env.STRIPE_PRICE_ID_PRO_MONTHLY || 'price_pro_monthly_aamc');

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          customer_email: userEmail,
          client_reference_id: userId,
          metadata: { userId, plan },
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: `${req.protocol}://${req.get('host')}/?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.protocol}://${req.get('host')}/?payment_status=canceled`,
        });

        return res.json({ ok: true, checkoutUrl: session.url });
      } catch (stripeErr: any) {
        console.warn('Stripe API Session Creation Error:', stripeErr.message);
        if (process.env.NODE_ENV === 'production') {
          return res.status(500).json({ ok: false, error: `Stripe checkout error: ${stripeErr.message}` });
        }
      }
    }

    // In production, NEVER fall back to simulated checkout
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        ok: false,
        error: 'Stripe payment gateway is not configured on this production server (STRIPE_SECRET_KEY missing).'
      });
    }

    // Development / Simulation Mode Fallback
    const simCheckoutUrl = `${req.protocol}://${req.get('host')}/?simulated_checkout=true&userId=${encodeURIComponent(userId)}&plan=${plan}&currency=${currency || 'USD'}`;
    return res.json({
      ok: true,
      checkoutUrl: simCheckoutUrl,
      mode: 'simulation',
      note: 'In development test mode. Simulated checkout page generated.',
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: 'Failed to create checkout session.' });
  }
});

// SIMULATE PAYMENT WEBHOOK (Development Diagnostic Mode)
paymentRouter.post('/simulate-webhook', (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_TEST_PAYMENTS !== 'true') {
    return res.status(403).json({ ok: false, error: 'Test webhooks disabled in production.' });
  }

  const { userId, plan, action, eventId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'userId is required for test webhook.' });
  }

  const targetEventId = eventId || `sim_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (dbStore.isPaymentEventProcessed(targetEventId)) {
    return res.json({ ok: true, note: 'Payment event already processed (replay protected).' });
  }

  const user = dbStore.getUserById(userId);
  if (!user) {
    return res.status(404).json({ ok: false, error: 'User not found for test webhook.' });
  }

  let targetPlan: 'free' | 'pro_monthly' | 'pro_yearly' = plan || 'pro_monthly';
  let targetStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' = 'active';

  if (action === 'cancel') {
    targetStatus = 'canceled';
  } else if (action === 'past_due') {
    targetStatus = 'past_due';
  } else if (action === 'expire') {
    targetPlan = 'free';
    targetStatus = 'expired';
  }

  const updatedSub = dbStore.updateSubscriptionPlan(userId, targetPlan, targetStatus);
  dbStore.recordPaymentEvent({
    provider: 'test',
    providerEventId: targetEventId,
    type: action === 'cancel' ? 'customer.subscription.deleted' : 'checkout.session.completed',
    payload: { userId, targetPlan, targetStatus },
  });

  const entitlements = dbStore.getEntitlements(userId);

  return res.json({
    ok: true,
    message: `Simulated webhook processed for ${user.email}.`,
    subscription: updatedSub,
    entitlements,
  });
});

// STRIPE OFFICIAL WEBHOOK HANDLER
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!webhookSecret) {
      return res.status(500).send('Webhook Error: STRIPE_WEBHOOK_SECRET environment variable is not configured in production.');
    }
    if (!sig) {
      return res.status(400).send('Webhook Error: Missing stripe-signature header.');
    }
  }

  let event: any;

  try {
    if (webhookSecret && sig) {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-02-24' as any });
      event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
    } else {
      if (process.env.NODE_ENV === 'production') {
        return res.status(400).send('Webhook Error: Signature verification required in production.');
      }
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;
  if (!eventId) {
    return res.status(400).send('Missing event ID');
  }

  if (dbStore.isPaymentEventProcessed(eventId)) {
    console.log(`Payment event ${eventId} already processed. Skipping (replay protection).`);
    return res.json({ received: true, note: 'Already processed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan || 'pro_monthly';

        if (userId) {
          dbStore.updateSubscriptionPlan(userId, plan, 'active');
          console.log(`✓ Upgraded user ${userId} to ${plan} via Checkout Webhook.`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const status = subscription.status; // active, past_due, canceled, etc.
        const plan = subscription.metadata?.plan || 'pro_monthly';

        if (userId) {
          dbStore.updateSubscriptionPlan(userId, plan, status);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          dbStore.updateSubscriptionPlan(userId, 'free', 'canceled');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const userId = invoice.subscription_details?.metadata?.userId;

        if (userId) {
          dbStore.updateSubscriptionPlan(userId, 'pro_monthly', 'past_due');
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    dbStore.recordPaymentEvent({
      provider: 'stripe',
      providerEventId: eventId,
      type: event.type,
      payload: event.data?.object,
    });

    return res.json({ received: true });
  } catch (err: any) {
    console.error('Error handling payment webhook event:', err);
    return res.status(500).send('Webhook handler failed.');
  }
});

// CREATE CUSTOMER PORTAL SESSION
paymentRouter.post('/create-portal-session', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (stripeSecret && user.stripeCustomerId && stripeSecret !== 'MY_STRIPE_SECRET_KEY') {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeSecret, { apiVersion: '2025-02-24' as any });

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${req.protocol}://${req.get('host')}/?manage_sub=closed`,
      });

      return res.json({ ok: true, portalUrl: session.url });
    } catch (err: any) {
      console.warn('Stripe Portal creation note:', err.message);
    }
  }

  // In production, do not fall back to simulation
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      ok: false,
      error: 'Stripe Customer Portal is not configured on this production server.'
    });
  }

  // Simulation fallback portal for development
  return res.json({
    ok: true,
    portalUrl: `${req.protocol}://${req.get('host')}/?simulated_portal=true`,
  });
});
