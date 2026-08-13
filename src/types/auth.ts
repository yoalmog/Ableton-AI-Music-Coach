export type AuthState = 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED' | 'GUEST';

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_yearly';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'expired'
  | 'incomplete';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  language: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  favoriteGenre: string;
  learningGoal: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  isGuest?: boolean;
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

export interface UsageInfo {
  userId: string;
  period: string;
  aiCloudRequestsCount: number;
  aiCloudRequestsLimit: number;
  projectsCount: number;
  lastRequestAt: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: UserProfile;
  entitlements?: Entitlements;
  usage?: UsageInfo;
  licenseToken?: string;
  error?: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  passwordPlain: string;
  language?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  favoriteGenre?: string;
  learningGoal?: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export function validatePasswordComplexity(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
  };
}
