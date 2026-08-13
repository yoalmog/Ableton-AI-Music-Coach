import { authService } from './authService';
import { Entitlements, SubscriptionPlan, SubscriptionStatus, UsageInfo } from '../types/auth';

export type ProFeatureKey =
  | 'aiCoach'
  | 'advancedLessons'
  | 'advancedMidi'
  | 'advancedBass'
  | 'advancedSoundDesign'
  | 'trackAnalyzer'
  | 'earTraining'
  | 'unlimitedProjects';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt?: string | null;
  cancelAtPeriodEnd?: boolean;
}

class SubscriptionService {
  public getSubscription(): SubscriptionInfo {
    const user = authService.getCurrentUser();
    return {
      plan: user?.subscriptionPlan || 'free',
      status: user?.subscriptionStatus || 'active',
      expiresAt: user?.subscriptionExpiresAt || null,
    };
  }

  public getEntitlements(): Entitlements {
    return authService.getEntitlements();
  }

  public isPro(): boolean {
    const sub = this.getSubscription();
    return (
      (sub.plan === 'pro_monthly' || sub.plan === 'pro_yearly') &&
      (sub.status === 'active' || sub.status === 'trialing')
    );
  }

  public canUseFeature(featureKey: ProFeatureKey): boolean {
    const ent = this.getEntitlements();
    return Boolean(ent[featureKey]);
  }

  public async refreshSubscription(): Promise<SubscriptionInfo> {
    await authService.initSession();
    return this.getSubscription();
  }

  public async createCheckoutSession(
    plan: 'pro_monthly' | 'pro_yearly',
    currency = 'USD'
  ): Promise<{ ok: boolean; checkoutUrl?: string; error?: string }> {
    const token = authService.getToken();
    if (!token && !authService.isGuest()) {
      return { ok: false, error: 'Please log in to upgrade your account.' };
    }

    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ plan, currency }),
      });

      const data = await res.json();
      if (data.ok && data.checkoutUrl) {
        return { ok: true, checkoutUrl: data.checkoutUrl };
      }
      return { ok: false, error: data.error || 'Could not initiate checkout session.' };
    } catch {
      return { ok: false, error: 'Network error connecting to payment gateway.' };
    }
  }

  public async manageSubscription(): Promise<{ ok: boolean; portalUrl?: string; error?: string }> {
    const token = authService.getToken();
    if (!token) return { ok: false, error: 'Not authenticated.' };

    try {
      const res = await fetch('/api/payments/create-portal-session', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok && data.portalUrl) {
        return { ok: true, portalUrl: data.portalUrl };
      }
      return { ok: false, error: data.error || 'Could not open subscription management portal.' };
    } catch {
      return { ok: false, error: 'Network error.' };
    }
  }

  public getUsage(): UsageInfo | null {
    return authService.getUsage();
  }
}

export const subscriptionService = new SubscriptionService();
