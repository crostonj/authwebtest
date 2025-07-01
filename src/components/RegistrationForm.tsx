import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { registrationRequest } from '../authConfig';

interface RegistrationFormProps {
  onClose?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegistration = async () => {
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      // For Azure External Identity, you can pass additional parameters
      const registrationRequestWithHints = {
        ...registrationRequest,
        loginHint: formData.email, // Pre-fill email in the registration form
        extraQueryParameters: {
          // Pass additional data that your Azure External Identity setup can handle
          given_name: formData.firstName,
          family_name: formData.lastName,
        }
      };

      const response = await instance.loginPopup(registrationRequestWithHints);
      console.log('Registration successful:', response);
      
      // Registration successful - the user is now signed in
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle specific registration errors
      const errorMessage = error as any;
      const errorString = errorMessage?.errorMessage || errorMessage?.message || '';
      
      if (errorString.includes('redirect_uri') || errorString.includes('invalid_request')) {
        alert(`
          Registration Error: ${errorString.includes('redirect_uri') ? 'Redirect URI Issue' : 'Authentication Issue'}
          
          ${errorString.includes('redirect_uri') ? 
            `The redirect URI is not properly registered in Azure.
          
          To fix this:
          1. Go to Azure Portal → App registrations
          2. Find your app (Client ID: dc245087-4913-4425-a15b-35b672d7b98f)
          3. Go to Authentication
          4. Add these redirect URIs:
             - http://localhost:3000
             - http://localhost:3000/
             - ${window.location.origin}
          5. Save and try again` :
            `The authentication flow encountered an issue.
          
          This might be:
          - A temporary Azure service issue
          - Network connectivity issue
          - Configuration issue
          
          Please:
          1. Wait a few moments and try again
          2. Check if you're already signed in
          3. Clear browser cache and try again
          4. Contact support if the issue persists`}
        `);
      } else if (errorString.includes('AADB2C90118')) {
        console.log('User cancelled registration');
      } else if (errorString.includes('user_exists')) {
        alert('An account with this email already exists. Please try signing in instead.');
      } else {
        alert(`Registration failed: ${errorString || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      maxWidth: '400px',
      margin: '20px auto',
      border: '1px solid #e1e4e8'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '25px', 
        color: '#24292e',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Create Your Account
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); handleRegistration(); }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: '600',
            color: '#24292e',
            fontSize: '14px'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5da',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#24292e',
              fontSize: '14px'
            }}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="John"
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: '600',
              color: '#24292e',
              fontSize: '14px'
            }}>
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Doe"
            />
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            fontSize: '14px',
            color: '#24292e'
          }}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              style={{ marginRight: '8px' }}
            />
            I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.agreeToTerms}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading || !formData.agreeToTerms ? '#94a3b8' : '#16a085',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading || !formData.agreeToTerms ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account with Azure'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f6f8fa',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#586069'
      }}>
        <p style={{ margin: 0 }}>
          This will redirect you to Azure External Identity to complete your registration.
          Your account will be created securely with Microsoft's identity platform.
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'transparent',
            color: '#586069',
            border: '1px solid #d1d5da',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
