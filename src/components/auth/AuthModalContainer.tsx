import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { VerifyEmailForm } from './VerifyEmailForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { authService } from '../../services/authService';

export type AuthScreenMode = 'welcome' | 'login' | 'register' | 'verifyEmail' | 'forgotPassword';

interface AuthModalContainerProps {
  initialMode?: AuthScreenMode;
  onSuccess: () => void;
}

export const AuthModalContainer: React.FC<AuthModalContainerProps> = ({
  initialMode = 'welcome',
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthScreenMode>(initialMode);

  const handleContinueAsGuest = () => {
    authService.continueAsGuest();
    onSuccess();
  };

  switch (mode) {
    case 'login':
      return (
        <LoginForm
          onSuccess={onSuccess}
          onSelectRegister={() => setMode('register')}
          onSelectForgotPassword={() => setMode('forgotPassword')}
          onBackToWelcome={() => setMode('welcome')}
          onContinueAsGuest={handleContinueAsGuest}
        />
      );

    case 'register':
      return (
        <RegisterForm
          onSuccess={() => setMode('verifyEmail')}
          onSelectLogin={() => setMode('login')}
          onBackToWelcome={() => setMode('welcome')}
          onContinueAsGuest={handleContinueAsGuest}
        />
      );

    case 'verifyEmail':
      return (
        <VerifyEmailForm
          onSuccess={onSuccess}
          onSelectLogin={() => setMode('login')}
        />
      );

    case 'forgotPassword':
      return (
        <ForgotPasswordForm
          onBackToLogin={() => setMode('login')}
        />
      );

    case 'welcome':
    default:
      return (
        <WelcomeScreen
          onSelectLogin={() => setMode('login')}
          onSelectRegister={() => setMode('register')}
          onSelectGuest={handleContinueAsGuest}
        />
      );
  }
};
