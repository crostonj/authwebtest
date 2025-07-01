import React from 'react';
import { useMsal } from '@azure/msal-react';

export const ExternalIdentityRegistration: React.FC = () => {
  const { instance } = useMsal();

  const handleSelfRegistration = () => {
    // For Azure External Identity, try different approaches
    const registrationRequest = {
      scopes: ['openid', 'profile', 'email'],
      authority: import.meta.env.VITE_AZURE_AUTHORITY,
      prompt: 'create',
      extraQueryParameters: {
        // These parameters help with Azure External Identity registration
        'domain_hint': 'consumers', // Hint for consumer accounts
        'signup': 'true'
      }
    };

    instance.loginPopup(registrationRequest)
      .then((response) => {
        console.log('Registration successful:', response);
      })
      .catch((error) => {
        console.error('Registration error:', error);
        
        // Handle specific Azure External Identity errors
        if (error.errorCode === 'invalid_grant' || error.errorMessage?.includes('AADSTS90072')) {
          alert(`
            🔐 Azure External Identity Registration Required
            
            Your organization account cannot directly register. Options:
            
            1. Use a personal email to create a consumer account
            2. Contact the administrator to enable external user invitations
            3. Ask to be added as an external user in the tenant
          `);
        } else {
          alert('Registration failed. Please try again or contact support.');
        }
      });
  };

  const handlePersonalAccountRegistration = () => {
    alert(`
      🎯 Using Personal Email for Registration
      
      For Azure External Identity, you can:
      
      1. Click "Create Account" and use a personal email
      2. Complete the registration process with Azure External Identity
      3. Your personal account will be registered in this tenant
      
      This is the recommended approach for customer scenarios.
    `);
    
    // Trigger the standard registration flow
    handleSelfRegistration();
  };

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      maxWidth: '600px',
      margin: '20px auto',
      border: '2px solid #0078d4'
    }}>
      <h2 style={{ 
        color: '#0078d4', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        🚀 Azure External Identity Registration
      </h2>
      
      <div style={{
        backgroundColor: '#e1f5fe',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #0288d1'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#01579b' }}>
          💡 For External Identity Registration:
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#0277bd',
          lineHeight: '1.6'
        }}>
          <li><strong>Use Personal Email:</strong> Any personal email address</li>
          <li><strong>Consumer Accounts:</strong> Designed for customer registration</li>
          <li><strong>Self-Service:</strong> No administrator approval needed</li>
          <li><strong>Secure:</strong> Full Azure identity protection</li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={handlePersonalAccountRegistration}
          style={{
            backgroundColor: '#16a085',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          📧 Register with Personal Email
        </button>
        
        <button
          onClick={handleSelfRegistration}
          style={{
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          🔐 Try Organization Account
        </button>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          ⚠️ Organization Account Issues?
        </h4>
        <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
          If you're getting AADSTS90072 errors with your organization account,
          this is normal for Azure External Identity. Use a personal email instead,
          or contact your administrator to be invited as an external user.
        </p>
      </div>
    </div>
  );
};
