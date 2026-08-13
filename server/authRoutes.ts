import express, { Request, Response } from 'express';
import { dbStore } from './dbStore.js';

export const authRouter = express.Router();

function validatePasswordComplexity(password: string): { isValid: boolean; reason?: string } {
  if (password.length < 8) return { isValid: false, reason: 'Password must be at least 8 characters long.' };
  if (!/[A-Z]/.test(password)) return { isValid: false, reason: 'Password must contain at least one uppercase letter.' };
  if (!/[a-z]/.test(password)) return { isValid: false, reason: 'Password must contain at least one lowercase letter.' };
  if (!/[0-9]/.test(password)) return { isValid: false, reason: 'Password must contain at least one number.' };
  return { isValid: true };
}

function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const session = dbStore.getSession(token);
  if (!session) return null;

  return dbStore.getUserById(session.userId);
}

// REGISTER
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { email, passwordPlain, displayName, language, experienceLevel, favoriteGenre, learningGoal } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'Display Name is required.' });
    }

    const checkPass = validatePasswordComplexity(passwordPlain || '');
    if (!checkPass.isValid) {
      return res.status(400).json({ ok: false, error: checkPass.reason });
    }

    const { user, verificationToken } = dbStore.createUser({
      email,
      passwordPlain,
      displayName,
      language: language || 'en',
      experienceLevel,
      favoriteGenre,
      learningGoal,
    });

    const session = dbStore.createSession(user.userId);
    const entitlements = dbStore.getEntitlements(user.userId);
    const usage = dbStore.getUsage(user.userId);
    const license = dbStore.generateOfflineLicenseToken(user.userId);

    // Omit sensitive hashes
    const safeUser = { ...user };
    delete (safeUser as any).passwordHash;

    return res.json({
      ok: true,
      token: session.token,
      user: safeUser,
      entitlements,
      usage,
      verificationToken,
      licenseToken: license.token,
      message: 'Registration successful! Verification link sent to email.',
    });
  } catch (err: any) {
    return res.status(400).json({ ok: false, error: err.message || 'Registration failed.' });
  }
});

// LOGIN
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, passwordPlain } = req.body || {};

    if (!email || !passwordPlain) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    const validPass = dbStore.verifyPassword(user, passwordPlain);
    if (!validPass) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    const session = dbStore.createSession(user.userId);
    const entitlements = dbStore.getEntitlements(user.userId);
    const usage = dbStore.getUsage(user.userId);
    const license = dbStore.generateOfflineLicenseToken(user.userId);

    const safeUser = { ...user };
    delete (safeUser as any).passwordHash;

    return res.json({
      ok: true,
      token: session.token,
      user: safeUser,
      entitlements,
      usage,
      licenseToken: license.token,
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: 'Authentication failed.' });
  }
});

// CURRENT USER / ME
authRouter.get('/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const entitlements = dbStore.getEntitlements(user.userId);
  const usage = dbStore.getUsage(user.userId);
  const license = dbStore.generateOfflineLicenseToken(user.userId);

  const safeUser = { ...user };
  delete (safeUser as any).passwordHash;

  return res.json({
    ok: true,
    user: safeUser,
    entitlements,
    usage,
    licenseToken: license.token,
  });
});

// LOGOUT
authRouter.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token) {
    dbStore.revokeSession(token);
  }
  return res.json({ ok: true });
});

// VERIFY EMAIL
authRouter.post('/verify-email', (req: Request, res: Response) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ ok: false, error: 'Verification token required.' });
  }

  const success = dbStore.verifyEmailToken(token);
  if (!success) {
    return res.status(400).json({ ok: false, error: 'Invalid or expired verification token.' });
  }

  return res.json({ ok: true, message: 'Email verified successfully.' });
});

// RESEND VERIFICATION
authRouter.post('/resend-verification', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const token = `vtok_${Math.random().toString(36).substring(2)}`;
  user.verificationToken = token;

  return res.json({
    ok: true,
    message: `Verification link sent to ${user.email}.`,
  });
});

// FORGOT PASSWORD
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ ok: false, error: 'Email address required.' });
  }

  const result = dbStore.createPasswordResetToken(email);
  if (!result) {
    // Return friendly message even if email not found to prevent user enumeration
    return res.json({
      ok: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  }

  return res.json({
    ok: true,
    message: 'Password reset link sent to your email address.',
    resetToken: process.env.NODE_ENV === 'development' ? result.token : undefined,
  });
});

// RESET PASSWORD
authRouter.post('/reset-password', (req: Request, res: Response) => {
  const { token, newPasswordPlain } = req.body || {};
  if (!token || !newPasswordPlain) {
    return res.status(400).json({ ok: false, error: 'Token and new password are required.' });
  }

  const checkPass = validatePasswordComplexity(newPasswordPlain);
  if (!checkPass.isValid) {
    return res.status(400).json({ ok: false, error: checkPass.reason });
  }

  const success = dbStore.resetPasswordWithToken(token, newPasswordPlain);
  if (!success) {
    return res.status(400).json({ ok: false, error: 'Invalid or expired reset token.' });
  }

  return res.json({ ok: true, message: 'Password reset successfully. You can now log in.' });
});

// CHANGE PASSWORD
authRouter.post('/change-password', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const { oldPasswordPlain, newPasswordPlain } = req.body || {};
  if (!oldPasswordPlain || !newPasswordPlain) {
    return res.status(400).json({ ok: false, error: 'Both current and new password are required.' });
  }

  const valid = dbStore.verifyPassword(user, oldPasswordPlain);
  if (!valid) {
    return res.status(400).json({ ok: false, error: 'Current password is incorrect.' });
  }

  const checkPass = validatePasswordComplexity(newPasswordPlain);
  if (!checkPass.isValid) {
    return res.status(400).json({ ok: false, error: checkPass.reason });
  }

  dbStore.updatePassword(user.userId, newPasswordPlain);
  return res.json({ ok: true, message: 'Password changed successfully.' });
});

// UPDATE PROFILE
authRouter.put('/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const { displayName, language, experienceLevel, favoriteGenre, learningGoal } = req.body || {};

  const updatedUser = dbStore.updateUserProfile(user.userId, {
    displayName,
    language,
    experienceLevel,
    favoriteGenre,
    learningGoal,
  });

  if (!updatedUser) {
    return res.status(400).json({ ok: false, error: 'Failed to update profile.' });
  }

  const safeUser = { ...updatedUser };
  delete (safeUser as any).passwordHash;

  return res.json({ ok: true, user: safeUser });
});

// DELETE ACCOUNT
authRouter.post('/delete-account', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const success = dbStore.deleteUserAccount(user.userId);
  if (!success) {
    return res.status(400).json({ ok: false, error: 'Could not delete account.' });
  }

  return res.json({ ok: true, message: 'Account deleted.' });
});

// EXPORT DATA
authRouter.get('/export-data', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }

  const sub = dbStore.getSubscription(user.userId);
  const ent = dbStore.getEntitlements(user.userId);
  const usage = dbStore.getUsage(user.userId);

  const safeUser = { ...user };
  delete (safeUser as any).passwordHash;

  return res.json({
    exportedAt: new Date().toISOString(),
    profile: safeUser,
    subscription: sub,
    entitlements: ent,
    usage: usage,
  });
});
