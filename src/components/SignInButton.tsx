import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

interface SignInButtonProps {
  className?: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      console.log('🔐 Starting popup login...');
      
      const response = await instance.loginPopup(loginRequest);
      console.log('✅ Login successful:', response);
      
      // The popup should automatically close and redirect back to main window
      // No additional navigation needed
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      // Handle specific popup errors
      if (error.errorCode === 'user_cancelled') {
        console.log('ℹ️ User cancelled login');
      } else if (error.errorCode === 'popup_window_error') {
        console.error('Popup window error - trying redirect flow...');
        // Fallback to redirect if popup fails
        try {
          await instance.loginRedirect(loginRequest);
        } catch (redirectError) {
          console.error('❌ Redirect login also failed:', redirectError);
        }
      } else {
        alert(`Login failed: ${error.errorMessage || error.message}`);
      }
    }
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
