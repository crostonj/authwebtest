import React from 'react';
import { useMsal } from '@azure/msal-react';

interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/"
    });
  };

  return (
    <button 
      onClick={handleLogout}
      className={className}
      style={{
        backgroundColor: '#d13438',
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
      Sign Out
    </button>
  );
};
