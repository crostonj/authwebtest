import React from 'react';
import { useMsal } from '@azure/msal-react';
import { registrationRequest } from '../authConfig';

interface SignUpButtonProps {
  className?: string;
}

export const SignUpButton: React.FC<SignUpButtonProps> = ({ className }) => {
  const { instance } = useMsal();

  const handleSignUp = async () => {
    try {
      console.log('📝 Starting registration popup...');
      
      const response = await instance.loginPopup(registrationRequest);
      console.log('✅ Registration successful:', response);
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      
      // Handle registration-specific errors
      if (error.errorCode === 'user_cancelled') {
        console.log('ℹ️ User cancelled registration');
      } else if (error.errorCode === 'popup_window_error') {
        console.error('Popup window error during registration...');
        // Fallback to redirect if popup fails
        try {
          await instance.loginRedirect(registrationRequest);
        } catch (redirectError) {
          console.error('❌ Redirect registration also failed:', redirectError);
        }
      } else {
        alert(`Registration failed: ${error.errorMessage || error.message}`);
      }
    }
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
