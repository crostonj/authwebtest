import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

interface SignInButtonProps {
  className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return (
    <button 
      onClick={handleLogin}
      className={className}
      style={{
        backgroundColor: '#0078d4',
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
      Sign In with Azure
    </button>
  );
};
