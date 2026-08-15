import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  displayName: string;
  language: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  favoriteGenre?: string;
  learningGoal?: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' | 'incomplete';
  subscriptionPlan: 'free' | 'pro_monthly' | 'pro_yearly';
  subscriptionExpiresAt?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro_monthly' | 'pro_yearly';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  updatedAt: string;
}

export interface Entitlements {
  aiCoach: boolean;
  advancedLessons: boolean;
  advancedMidi: boolean;
  advancedBass: boolean;
  advancedSoundDesign: boolean;
  trackAnalyzer: boolean;
  earTraining: boolean;
  unlimitedProjects: boolean;
}

export interface Usage {
  userId: string;
  period: string; // e.g. "2026-08"
  aiCloudRequestsCount: number;
  aiCloudRequestsLimit: number; // 15 for free, 1000 for pro
  projectsCount: number;
  lastRequestAt: string;
}

export interface PaymentEvent {
  id: string;
  provider: 'stripe' | 'test';
  providerEventId: string;
  type: string;
  receivedAt: string;
  processedAt: string;
  payload: any;
}

interface DatabaseSchema {
  users: Record<string, User>; // userId -> User
  emailToUserId: Record<string, string>; // email -> userId
  sessions: Record<string, Session>; // token -> Session
  subscriptions: Record<string, Subscription>; // userId -> Subscription
  usage: Record<string, Record<string, Usage>>; // userId -> period -> Usage
  paymentEvents: Record<string, PaymentEvent>; // providerEventId -> PaymentEvent
  verificationTokens: Record<string, string>; // token -> userId
  resetPasswordTokens: Record<string, { userId: string; expiresAt: string }>;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'aamc_db.json');
const LICENSE_SECRET = process.env.AAMC_LICENSE_SECRET || 'aamc-pro-secure-license-hmac-key-2026';

class DbStore {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadDatabase();
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultEmail = 'yoalmog@gmail.com';
    const existing = this.getUserByEmail(defaultEmail);
    const passwordHash = this.hashPassword('1985Yossi');
    const now = new Date().toISOString();

    if (!existing) {
      const userId = 'usr_yoalmog_primary';
      const user: User = {
        userId,
        email: defaultEmail,
        passwordHash,
        displayName: 'Yossi Almog',
        language: 'he',
        createdAt: now,
        lastLoginAt: now,
        emailVerified: true,
        experienceLevel: 'Advanced',
        favoriteGenre: 'Psytrance',
        learningGoal: 'Master Psytrance production & Ableton Live coaching',
        subscriptionStatus: 'active',
        subscriptionPlan: 'pro_yearly',
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      this.db.users[userId] = user;
      this.db.emailToUserId[defaultEmail] = userId;
      this.db.subscriptions[userId] = {
        id: `sub_${userId}`,
        userId,
        plan: 'pro_yearly',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        updatedAt: now,
      };
      this.saveDatabase();
    } else {
      existing.passwordHash = passwordHash;
      existing.emailVerified = true;
      if (existing.subscriptionPlan === 'free') {
        existing.subscriptionPlan = 'pro_yearly';
        existing.subscriptionStatus = 'active';
      }
      this.saveDatabase();
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to load DB file, initializing fresh store:', err);
    }

    return {
      users: {},
      emailToUserId: {},
      sessions: {},
      subscriptions: {},
      usage: {},
      paymentEvents: {},
      verificationTokens: {},
      resetPasswordTokens: {},
    };
  }

  private saveDatabase() {
    try {
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const tmpPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE_PATH);
    } catch (err) {
      console.error('Failed to save DB file:', err);
    }
  }

  // Password Hashing Helper
  public hashPassword(password: string, salt = 'aamc_salt_2026'): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  // User Management
  public getUserByEmail(email: string): User | null {
    const normalized = email.trim().toLowerCase();
    const userId = this.db.emailToUserId[normalized];
    if (!userId) return null;
    return this.db.users[userId] || null;
  }

  public getUserById(userId: string): User | null {
    return this.db.users[userId] || null;
  }

  public createUser(userData: {
    email: string;
    passwordPlain: string;
    displayName: string;
    language?: string;
    experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    favoriteGenre?: string;
    learningGoal?: string;
  }): { user: User; verificationToken: string } {
    const normalizedEmail = userData.email.trim().toLowerCase();
    if (this.db.emailToUserId[normalizedEmail]) {
      throw new Error('An account with this email already exists.');
    }

    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const passwordHash = this.hashPassword(userData.passwordPlain);
    const verificationToken = `vtok_${crypto.randomBytes(24).toString('hex')}`;
    const now = new Date().toISOString();

    const newUser: User = {
      userId,
      email: normalizedEmail,
      passwordHash,
      displayName: userData.displayName.trim() || 'Producer',
      language: userData.language || 'en',
      createdAt: now,
      lastLoginAt: now,
      emailVerified: false,
      verificationToken,
      experienceLevel: userData.experienceLevel || 'Beginner',
      favoriteGenre: userData.favoriteGenre || 'Psytrance',
      learningGoal: userData.learningGoal || 'Learn to produce complete tracks',
      subscriptionStatus: 'active',
      subscriptionPlan: 'free',
    };

    this.db.users[userId] = newUser;
    this.db.emailToUserId[normalizedEmail] = userId;
    this.db.verificationTokens[verificationToken] = userId;

    // Initialize Default Subscription
    this.db.subscriptions[userId] = {
      id: `sub_${userId}`,
      userId,
      plan: 'free',
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      updatedAt: now,
    };

    this.saveDatabase();
    return { user: newUser, verificationToken };
  }

  public verifyPassword(user: User, passwordPlain: string): boolean {
    const hash = this.hashPassword(passwordPlain);
    return crypto.timingSafeEqual(Buffer.from(user.passwordHash), Buffer.from(hash));
  }

  public verifyEmailToken(token: string): boolean {
    const userId = this.db.verificationTokens[token];
    if (!userId || !this.db.users[userId]) return false;

    this.db.users[userId].emailVerified = true;
    this.db.users[userId].verificationToken = null;
    delete this.db.verificationTokens[token];
    this.saveDatabase();
    return true;
  }

  public createPasswordResetToken(email: string): { token: string; expiresAt: string } | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    const token = `rst_${crypto.randomBytes(24).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    this.db.resetPasswordTokens[token] = { userId: user.userId, expiresAt };
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;

    this.saveDatabase();
    return { token, expiresAt };
  }

  public resetPasswordWithToken(token: string, newPasswordPlain: string): boolean {
    const resetData = this.db.resetPasswordTokens[token];
    if (!resetData) return false;

    if (new Date(resetData.expiresAt).getTime() < Date.now()) {
      delete this.db.resetPasswordTokens[token];
      this.saveDatabase();
      return false;
    }

    const user = this.db.users[resetData.userId];
    if (!user) return false;

    user.passwordHash = this.hashPassword(newPasswordPlain);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    delete this.db.resetPasswordTokens[token];

    this.saveDatabase();
    return true;
  }

  public updatePassword(userId: string, newPasswordPlain: string): boolean {
    const user = this.db.users[userId];
    if (!user) return false;
    user.passwordHash = this.hashPassword(newPasswordPlain);
    this.saveDatabase();
    return true;
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, 'displayName' | 'language' | 'experienceLevel' | 'favoriteGenre' | 'learningGoal'>>
  ): User | null {
    const user = this.db.users[userId];
    if (!user) return null;

    if (updates.displayName !== undefined) user.displayName = updates.displayName.trim();
    if (updates.language !== undefined) user.language = updates.language;
    if (updates.experienceLevel !== undefined) user.experienceLevel = updates.experienceLevel;
    if (updates.favoriteGenre !== undefined) user.favoriteGenre = updates.favoriteGenre;
    if (updates.learningGoal !== undefined) user.learningGoal = updates.learningGoal;

    this.saveDatabase();
    return user;
  }

  public deleteUserAccount(userId: string): boolean {
    const user = this.db.users[userId];
    if (!user) return false;

    delete this.db.emailToUserId[user.email];
    delete this.db.users[userId];
    delete this.db.subscriptions[userId];
    delete this.db.usage[userId];

    // Clean sessions
    Object.keys(this.db.sessions).forEach((token) => {
      if (this.db.sessions[token].userId === userId) {
        delete this.db.sessions[token];
      }
    });

    this.saveDatabase();
    return true;
  }

  // Session Management
  public createSession(userId: string): Session {
    const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const session: Session = {
      token,
      userId,
      createdAt: now.toISOString(),
      expiresAt,
    };

    this.db.sessions[token] = session;

    if (this.db.users[userId]) {
      this.db.users[userId].lastLoginAt = now.toISOString();
    }

    this.saveDatabase();
    return session;
  }

  public getSession(token: string): Session | null {
    if (!token) return null;
    const session = this.db.sessions[token];
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      delete this.db.sessions[token];
      this.saveDatabase();
      return null;
    }

    return session;
  }

  public revokeSession(token: string) {
    if (this.db.sessions[token]) {
      delete this.db.sessions[token];
      this.saveDatabase();
    }
  }

  // Subscription & Entitlements
  public getSubscription(userId: string): Subscription {
    const sub = this.db.subscriptions[userId];
    if (sub) return sub;

    const defaultSub: Subscription = {
      id: `sub_${userId}`,
      userId,
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
    };
    this.db.subscriptions[userId] = defaultSub;
    this.saveDatabase();
    return defaultSub;
  }

  public updateSubscriptionPlan(
    userId: string,
    plan: 'free' | 'pro_monthly' | 'pro_yearly',
    status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' | 'incomplete' = 'active',
    expiresAt?: string
  ): Subscription {
    const user = this.db.users[userId];
    const now = new Date();
    const durationDays = plan === 'pro_yearly' ? 365 : 30;
    const periodEnd = expiresAt || new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const sub: Subscription = {
      id: `sub_${userId}`,
      userId,
      plan,
      status,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: status === 'canceled',
      updatedAt: now.toISOString(),
    };

    this.db.subscriptions[userId] = sub;

    if (user) {
      user.subscriptionPlan = plan;
      user.subscriptionStatus = status;
      user.subscriptionExpiresAt = periodEnd;
    }

    this.saveDatabase();
    return sub;
  }

  public getEntitlements(userId: string): Entitlements {
    const user = this.db.users[userId];
    const sub = this.getSubscription(userId);

    const isProActive =
      (sub.plan === 'pro_monthly' || sub.plan === 'pro_yearly') &&
      (sub.status === 'active' || sub.status === 'trialing');

    if (isProActive) {
      return {
        aiCoach: true,
        advancedLessons: true,
        advancedMidi: true,
        advancedBass: true,
        advancedSoundDesign: true,
        trackAnalyzer: true,
        earTraining: true,
        unlimitedProjects: true,
      };
    }

    return {
      aiCoach: true, // Free users can access AI coach up to monthly usage limit
      advancedLessons: false,
      advancedMidi: false,
      advancedBass: false,
      advancedSoundDesign: false,
      trackAnalyzer: false,
      earTraining: false,
      unlimitedProjects: false,
    };
  }

  // Usage Metering
  public getUsage(userId: string): Usage {
    const period = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    if (!this.db.usage[userId]) {
      this.db.usage[userId] = {};
    }

    const ent = this.getEntitlements(userId);
    const limit = ent.advancedMidi ? 1000 : 15; // 15 requests/month for Free, 1000 for Pro

    if (!this.db.usage[userId][period]) {
      this.db.usage[userId][period] = {
        userId,
        period,
        aiCloudRequestsCount: 0,
        aiCloudRequestsLimit: limit,
        projectsCount: 1,
        lastRequestAt: new Date().toISOString(),
      };
      this.saveDatabase();
    } else {
      this.db.usage[userId][period].aiCloudRequestsLimit = limit;
    }

    return this.db.usage[userId][period];
  }

  public incrementAiUsage(userId: string): { allowed: boolean; usage: Usage } {
    const usage = this.getUsage(userId);
    const ent = this.getEntitlements(userId);

    if (!ent.advancedMidi && usage.aiCloudRequestsCount >= usage.aiCloudRequestsLimit) {
      return { allowed: false, usage };
    }

    usage.aiCloudRequestsCount += 1;
    usage.lastRequestAt = new Date().toISOString();
    this.saveDatabase();
    return { allowed: true, usage };
  }

  // Payment Event Deduping & Verification
  public isPaymentEventProcessed(eventId: string): boolean {
    return Boolean(this.db.paymentEvents[eventId]);
  }

  public recordPaymentEvent(event: {
    provider: 'stripe' | 'test';
    providerEventId: string;
    type: string;
    payload: any;
  }): PaymentEvent {
    const paymentEvent: PaymentEvent = {
      id: `pevt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      provider: event.provider,
      providerEventId: event.providerEventId,
      type: event.type,
      receivedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      payload: event.payload,
    };

    this.db.paymentEvents[event.providerEventId] = paymentEvent;
    this.saveDatabase();
    return paymentEvent;
  }

  // HMAC Offline License Generation
  public generateOfflineLicenseToken(userId: string): {
    token: string;
    validUntil: string;
    plan: string;
  } {
    const user = this.getUserById(userId);
    const ent = this.getEntitlements(userId);
    const plan = user?.subscriptionPlan || 'free';
    const status = user?.subscriptionStatus || 'active';
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days grace period

    const payload = JSON.stringify({
      userId,
      plan,
      status,
      entitlements: ent,
      validUntil,
    });

    const signature = crypto.createHmac('sha256', LICENSE_SECRET).update(payload).digest('hex');

    const token = Buffer.from(JSON.stringify({ payload, signature })).toString('base64');
    return { token, validUntil, plan };
  }
}

export const dbStore = new DbStore();
