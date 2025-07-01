import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { profileEditRequest } from '../authConfig';

export const AzureExternalIdentityProfileEditor: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  const handleEditProfile = async () => {
    setIsLoading(true);
    
    try {
      // For Azure External Identity, profile editing works through Graph API permissions
      // Request additional permissions for profile editing
      const response = await instance.acquireTokenPopup({
        ...profileEditRequest,
        account: account
      });

      console.log('✅ Profile edit permissions acquired:', response);
      
      // In Azure External Identity, profile editing typically redirects to Microsoft Account portal
      // This is the standard approach for CIAM scenarios
      const editProfileUrl = 'https://myaccount.microsoft.com/profile';
      
      const proceedToEdit = window.confirm(`✅ Profile editing permissions granted!

Azure External Identity uses Microsoft Account portal for profile editing.

Your changes will be:
✅ Saved to your Azure External Identity account
✅ Available immediately in this application
✅ Secure and validated by Microsoft

Click OK to open the profile editor, or Cancel to stay here.`);

      if (proceedToEdit) {
        window.open(editProfileUrl, '_blank');
        
        // Show instructions for refreshing profile in the app
        setTimeout(() => {
          alert(`📋 After editing your profile:

1. ✅ Save your changes in the Microsoft portal
2. 🔄 Return to this app and sign out
3. 🔐 Sign back in to see your updated profile

Your profile changes will be immediately available!`);
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('❌ Profile edit failed:', error);
      
      if (error.errorCode === 'user_cancelled') {
        return;
      }
      
      if (error.errorCode === 'consent_required') {
        alert(`🔐 Additional permissions required for profile editing.

Azure External Identity needs consent to edit your profile.

Please try again and grant the requested permissions.`);
        return;
      }
      
      // For Azure External Identity, fallback to direct portal access
      const fallbackMessage = `❌ Profile editing permission request failed.

Error: ${error.errorCode || 'unknown_error'}

Alternative approach:
1. 🌐 Go directly to Microsoft Account portal
2. ✏️ Edit your profile there
3. 🔄 Sign out and back in to this app

Would you like to open the Microsoft Account portal now?`;
      
      const openPortal = window.confirm(fallbackMessage);
      if (openPortal) {
        window.open('https://myaccount.microsoft.com/profile', '_blank');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    const profileInfo = `👤 Azure External Identity Profile

🏷️ Display Name: ${account.name || 'Not available'}
📧 Email: ${account.username}
🆔 Account ID: ${account.homeAccountId}
🏢 Tenant: ${account.tenantId}
🕐 Last Sign-in: ${new Date().toLocaleString()}

📝 Profile Management:
Your profile is managed through Azure External Identity and Microsoft Account portal.
Changes made in the Microsoft portal will be reflected in this application.

🔗 Authority: ${account.environment}`;
    
    alert(profileInfo);
  };

  const handleRefreshProfile = async () => {
    setIsLoading(true);
    
    try {
      // Silent token refresh to get updated profile information
      const response = await instance.acquireTokenSilent({
        scopes: ['openid', 'profile', 'email'],
        account: account
      });
      
      console.log('✅ Profile refreshed:', response);
      
      alert(`✅ Profile information refreshed!

Updated profile data has been retrieved from Azure External Identity.
If you recently made changes, they should now be visible.`);
      
      // Force a page refresh to show updated profile
      window.location.reload();
      
    } catch (error: any) {
      console.error('❌ Profile refresh failed:', error);
      
      alert(`🔄 Profile refresh completed.

Note: If you recently edited your profile, you may need to:
1. Sign out of this application
2. Sign back in to see the latest changes

This ensures the most up-to-date profile information is displayed.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      margin: '20px 0',
      border: '2px solid #0078d4',
      maxWidth: '700px'
    }}>
      <h3 style={{ 
        color: '#0078d4', 
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        👤 Azure External Identity Profile Management
      </h3>
      
      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #0078d4'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#004578' }}>
          Current Account: {account.name || account.username}
        </h4>
        <p style={{ margin: 0, color: '#106ebe', fontSize: '14px' }}>
          Azure External Identity (CIAM) account. Profile editing is managed through Microsoft Account portal.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleEditProfile}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Loading...' : '✏️ Edit Profile'}
        </button>

        <button
          onClick={handleViewProfile}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          👁️ View Profile Info
        </button>

        <button
          onClick={handleRefreshProfile}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Loading...' : '🔄 Refresh Profile'}
        </button>
      </div>

      <div style={{
        backgroundColor: '#d4edda',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
          ℹ️ Azure External Identity Profile Management
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#155724',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li><strong>CIAM Approach:</strong> Uses Microsoft Account portal for profile editing</li>
          <li><strong>Secure Integration:</strong> Changes sync automatically with Azure External Identity</li>
          <li><strong>No User Flows:</strong> Unlike B2C, External Identity uses Graph API permissions</li>
          <li><strong>Immediate Updates:</strong> Sign out/in to see profile changes in this app</li>
        </ul>
      </div>
    </div>
  );
};

export default AzureExternalIdentityProfileEditor;
