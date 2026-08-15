import {
  UserProfile,
  Entitlements,
  UsageInfo,
  AuthResponse,
  RegisterRequest,
  AuthState,
} from '../types/auth';

const TOKEN_KEY = 'aamc_auth_token';
const GUEST_KEY = 'aamc_is_guest';
const GUEST_ID_KEY = 'aamc_guest_id';
const GUEST_TOKEN_KEY = 'aamc_guest_session_token';
const LICENSE_CACHE_KEY = 'aamc_license_cache';

function getOrCreateGuestId(): string {
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

function generateGuestToken(): string {
  return `gst_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
}

const GUEST_USER: UserProfile = {
  userId: 'guest_producer',
  email: 'guest@aamc.local',
  displayName: 'Guest Producer',
  language: 'en',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  emailVerified: false,
  experienceLevel: 'Beginner',
  favoriteGenre: 'Psytrance',
  learningGoal: 'Explore Ableton AI Music Coach',
  subscriptionStatus: 'active',
  subscriptionPlan: 'free',
  isGuest: true,
};

const DEFAULT_GUEST_ENTITLEMENTS: Entitlements = {
  aiCoach: true,
  advancedLessons: false,
  advancedMidi: false,
  advancedBass: false,
  advancedSoundDesign: false,
  trackAnalyzer: false,
  earTraining: false,
  unlimitedProjects: false,
};

class AuthService {
  private currentToken: string | null = null;
  private currentUser: UserProfile | null = null;
  private currentEntitlements: Entitlements = DEFAULT_GUEST_ENTITLEMENTS;
  private currentUsage: UsageInfo | null = null;
  private authState: AuthState = 'AUTH_LOADING';
  private listeners: Array<(state: AuthState, user: UserProfile | null) => void> = [];

  constructor() {
    this.currentToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(GUEST_TOKEN_KEY);
  }

  public subscribe(listener: (state: AuthState, user: UserProfile | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.authState, this.currentUser));
  }

  public getAuthState(): AuthState {
    return this.authState;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getEntitlements(): Entitlements {
    return this.currentEntitlements;
  }

  public getUsage(): UsageInfo | null {
    return this.currentUsage;
  }

  public getToken(): string | null {
    return this.currentToken;
  }

  public isGuest(): boolean {
    return Boolean(this.currentUser?.isGuest || this.authState === 'GUEST');
  }

  public async initSession(): Promise<{ state: AuthState; user: UserProfile | null }> {
    this.authState = 'AUTH_LOADING';
    this.notify();

    const isGuestStored = localStorage.getItem(GUEST_KEY) === 'true';
    const savedToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(GUEST_TOKEN_KEY);
    const guestId = getOrCreateGuestId();

    // Check for standard or guest session token
    if (savedToken) {
      const isGuestToken = savedToken.startsWith('gst_') || isGuestStored;

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data: AuthResponse = await res.json();
          if (data.ok && data.user) {
            this.currentToken = savedToken;
            this.currentUser = data.user;
            this.currentEntitlements = data.entitlements || DEFAULT_GUEST_ENTITLEMENTS;
            this.currentUsage = data.usage || null;
            this.authState = isGuestToken || data.user.isGuest ? 'GUEST' : 'AUTHENTICATED';

            if (data.licenseToken) {
              this.cacheOfflineLicense(data.licenseToken, data.user, data.entitlements);
            }

            this.notify();
            return { state: this.authState, user: this.currentUser };
          }
        }
      } catch (err) {
        console.warn('Network issue on initSession, checking offline license cache:', err);
        const cached = this.loadOfflineLicense();
        if (cached) {
          this.currentUser = cached.user;
          this.currentEntitlements = cached.entitlements;
          this.authState = isGuestToken || cached.user.isGuest ? 'GUEST' : 'AUTHENTICATED';
          this.notify();
          return { state: this.authState, user: this.currentUser };
        }
      }

      // If token was a valid guest token format, maintain guest session even if server was transiently unreachable
      if (isGuestToken) {
        this.currentToken = savedToken;
        this.currentUser = {
          ...GUEST_USER,
          userId: guestId,
        };
        this.currentEntitlements = DEFAULT_GUEST_ENTITLEMENTS;
        this.authState = 'GUEST';
        this.notify();
        return { state: 'GUEST', user: this.currentUser };
      }
    }

    if (isGuestStored) {
      const tempToken = generateGuestToken();
      this.currentToken = tempToken;
      this.currentUser = {
        ...GUEST_USER,
        userId: guestId,
      };
      this.currentEntitlements = DEFAULT_GUEST_ENTITLEMENTS;
      this.authState = 'GUEST';
      localStorage.setItem(GUEST_TOKEN_KEY, tempToken);
      localStorage.setItem(TOKEN_KEY, tempToken);
      this.notify();
      return { state: 'GUEST', user: this.currentUser };
    }

    this.authState = 'UNAUTHENTICATED';
    this.currentUser = null;
    this.notify();
    return { state: 'UNAUTHENTICATED', user: null };
  }

  public async login(email: string, passwordPlain: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordPlain }),
      });

      const data: AuthResponse = await res.json();
      if (data.ok && data.token && data.user) {
        this.currentToken = data.token;
        this.currentUser = data.user;
        this.currentEntitlements = data.entitlements || DEFAULT_GUEST_ENTITLEMENTS;
        this.currentUsage = data.usage || null;
        this.authState = 'AUTHENTICATED';

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.removeItem(GUEST_KEY);

        if (data.licenseToken) {
          this.cacheOfflineLicense(data.licenseToken, data.user, data.entitlements);
        }

        this.notify();
      }
      return data;
    } catch {
      return { ok: false, error: 'Network unavailable. Please check your internet connection.' };
    }
  }

  public async register(req: RegisterRequest): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data: AuthResponse = await res.json();
      if (data.ok && data.token && data.user) {
        this.currentToken = data.token;
        this.currentUser = data.user;
        this.currentEntitlements = data.entitlements || DEFAULT_GUEST_ENTITLEMENTS;
        this.currentUsage = data.usage || null;
        this.authState = 'AUTHENTICATED';

        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.removeItem(GUEST_KEY);

        if (data.licenseToken) {
          this.cacheOfflineLicense(data.licenseToken, data.user, data.entitlements);
        }

        this.notify();
      }
      return data;
    } catch {
      return { ok: false, error: 'Network unavailable. Please try again when online.' };
    }
  }

  public async logout(): Promise<void> {
    if (this.currentToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.currentToken}` },
        });
      } catch {}
    }

    this.currentToken = null;
    this.currentUser = null;
    this.currentEntitlements = DEFAULT_GUEST_ENTITLEMENTS;
    this.currentUsage = null;
    this.authState = 'UNAUTHENTICATED';

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem(GUEST_TOKEN_KEY);
    localStorage.removeItem(LICENSE_CACHE_KEY);

    this.notify();
  }

  public async continueAsGuest(): Promise<{ token: string; user: UserProfile }> {
    const guestId = getOrCreateGuestId();
    let token = generateGuestToken();

    const localGuestUser: UserProfile = {
      ...GUEST_USER,
      userId: guestId,
    };

    this.currentToken = token;
    this.currentUser = localGuestUser;
    this.currentEntitlements = DEFAULT_GUEST_ENTITLEMENTS;
    this.authState = 'GUEST';

    localStorage.setItem(GUEST_KEY, 'true');
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(GUEST_TOKEN_KEY, token);
    this.notify();

    // Sync with backend guest session in background
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      });
      if (res.ok) {
        const data: AuthResponse = await res.json();
        if (data.ok && data.token && data.user) {
          this.currentToken = data.token;
          this.currentUser = data.user;
          this.currentEntitlements = data.entitlements || DEFAULT_GUEST_ENTITLEMENTS;
          this.currentUsage = data.usage || null;
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(GUEST_TOKEN_KEY, data.token);
          this.notify();
          return { token: data.token, user: data.user };
        }
      }
    } catch {
      // Offline / network fallback is already active
    }

    return { token, user: localGuestUser };
  }

  public async requestPasswordReset(email: string): Promise<{ ok: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'Network unavailable. Could not send password reset request.' };
    }
  }

  public async resetPassword(token: string, newPasswordPlain: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPasswordPlain }),
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'Network unavailable.' };
    }
  }

  public async verifyEmail(token: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.ok && this.currentUser) {
        this.currentUser = { ...this.currentUser, emailVerified: true };
        this.notify();
      }
      return data;
    } catch {
      return { ok: false, error: 'Network unavailable.' };
    }
  }

  public async resendVerification(): Promise<{ ok: boolean; message?: string; error?: string }> {
    if (!this.currentToken) return { ok: false, error: 'Not authenticated.' };
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.currentToken}` },
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'Network unavailable.' };
    }
  }

  public async updateProfile(
    updates: Partial<Pick<UserProfile, 'displayName' | 'language' | 'experienceLevel' | 'favoriteGenre' | 'learningGoal'>>
  ): Promise<{ ok: boolean; user?: UserProfile; error?: string }> {
    if (this.isGuest()) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        this.notify();
      }
      return { ok: true, user: this.currentUser || undefined };
    }

    if (!this.currentToken) return { ok: false, error: 'Not authenticated.' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.currentToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        this.currentUser = data.user;
        this.notify();
      }
      return data;
    } catch {
      return { ok: false, error: 'Network error updating profile.' };
    }
  }

  public async changePassword(oldPasswordPlain: string, newPasswordPlain: string): Promise<{ ok: boolean; error?: string }> {
    if (!this.currentToken) return { ok: false, error: 'Not authenticated.' };

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.currentToken}`,
        },
        body: JSON.stringify({ oldPasswordPlain, newPasswordPlain }),
      });
      return await res.json();
    } catch {
      return { ok: false, error: 'Network error changing password.' };
    }
  }

  public async deleteAccount(): Promise<{ ok: boolean; error?: string }> {
    if (this.isGuest()) {
      this.logout();
      return { ok: true };
    }

    if (!this.currentToken) return { ok: false, error: 'Not authenticated.' };

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.currentToken}` },
      });
      const data = await res.json();
      if (data.ok) {
        this.logout();
      }
      return data;
    } catch {
      return { ok: false, error: 'Network error deleting account.' };
    }
  }

  public async exportData(): Promise<any> {
    if (!this.currentToken) return null;
    try {
      const res = await fetch('/api/auth/export-data', {
        headers: { Authorization: `Bearer ${this.currentToken}` },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  // Offline License Caching
  private cacheOfflineLicense(licenseToken: string, user: UserProfile, entitlements?: Entitlements) {
    try {
      const payload = {
        licenseToken,
        user,
        entitlements,
        cachedAt: new Date().toISOString(),
      };
      localStorage.setItem(LICENSE_CACHE_KEY, JSON.stringify(payload));
    } catch {}
  }

  private loadOfflineLicense(): { user: UserProfile; entitlements: Entitlements } | null {
    try {
      const raw = localStorage.getItem(LICENSE_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user) {
        return {
          user: parsed.user,
          entitlements: parsed.entitlements || DEFAULT_GUEST_ENTITLEMENTS,
        };
      }
    } catch {}
    return null;
  }
}

export const authService = new AuthService();
