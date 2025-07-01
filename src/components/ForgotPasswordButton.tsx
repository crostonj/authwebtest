import React from 'react';
import { useMsal } from '@azure/msal-react';

interface ForgotPasswordButtonProps {
  className?: string;
}

export const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleForgotPassword = () => {
    // For Azure External Identity, password reset is typically handled
    // through a specific user flow or policy
    const resetPasswordRequest = {
      scopes: ['openid', 'profile', 'email'],
      prompt: 'login' as const,
      extraQueryParameters: {
        // This depends on your Azure External Identity setup
        // You might need to specify a password reset user flow
        'ui_action': 'reset_password'
      }
    };

    instance.loginPopup(resetPasswordRequest)
      .then((response) => {
        console.log('Password reset initiated:', response);
      })
      .catch((e) => {
        console.error('Password reset failed:', e);
        
        // Handle password reset specific errors
        if (e.errorMessage?.includes('AADB2C90118')) {
          console.log('User cancelled password reset');
        } else {
          alert('Password reset failed. Please try again or contact support.');
        }
      });
  };

  return (
    <button 
      onClick={handleForgotPassword}
      className={className}
      style={{
        backgroundColor: 'transparent',
        color: '#0078d4',
        border: '1px solid #0078d4',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        textDecoration: 'underline',
        ...(!className && { margin: '5px' })
      }}
    >
      Forgot Password?
    </button>
  );
};
