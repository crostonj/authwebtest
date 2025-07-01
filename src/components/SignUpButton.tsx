import React from 'react';
import { useMsal } from '@azure/msal-react';
import { registrationRequest } from '../authConfig';

interface SignUpButtonProps {
  className?: string;
}

export const SignUpButton: React.FC<SignUpButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleSignUp = () => {
    // For Azure External Identity, sign-up can be handled in several ways:
    // 1. Using the same login flow with 'prompt: create'
    // 2. Using a dedicated sign-up user flow
    // 3. Using custom registration endpoints
    
    instance.loginPopup(registrationRequest)
      .then((response) => {
        console.log('Registration successful:', response);
      })
      .catch((e) => {
        console.error('Registration failed:', e);
        // Handle registration-specific errors
        if (e.errorMessage?.includes('AADB2C90118')) {
          // User cancelled the flow
          console.log('User cancelled registration');
        } else if (e.errorMessage?.includes('AADB2C90091')) {
          // User clicked "Forgot Password" during registration
          console.log('User requested password reset during registration');
        }
      });
  };

  return (
    <button 
      onClick={handleSignUp}
      className={className}
      style={{
        backgroundColor: '#16a085',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        ...(!className && { margin: '10px' })
      }}
    >
      Create Account
    </button>
  );
};
