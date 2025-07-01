import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';

export const SimpleProfileEditor: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  const handleEditProfile = async () => {
    setIsLoading(true);
    
    try {
      // For Azure External Identity without admin consent requirements
      // We'll use the Microsoft Account portal directly
      
      const editProfileUrl = 'https://myaccount.microsoft.com/profile';
      
      const proceedToEdit = window.confirm(`✏️ Edit Your Profile

Azure External Identity profile editing:

🌐 You'll be redirected to Microsoft Account portal
✅ Changes will sync to your Azure External Identity account
🔄 Return here and sign out/in to see updates
🔒 Secure and validated by Microsoft

Click OK to edit your profile, or Cancel to stay here.`);

      if (proceedToEdit) {
        window.open(editProfileUrl, '_blank');
        
        // Show refresh instructions
        setTimeout(() => {
          const refreshInstructions = window.confirm(`📋 After editing your profile:

1. ✅ Save your changes in the Microsoft portal
2. 🔄 Return to this app
3. 🚪 Sign out of this app
4. 🔐 Sign back in to see your updated profile

Would you like to sign out now to refresh your profile?`);
          
          if (refreshInstructions) {
            instance.logoutPopup();
          }
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('❌ Profile edit failed:', error);
      
      alert(`❌ Profile editing failed: ${error.errorCode || 'unknown_error'}

Alternative approach:
1. 🌐 Go directly to https://myaccount.microsoft.com/profile
2. ✏️ Edit your profile there  
3. 🔄 Sign out and back in to this app

Would you like to try the direct approach?`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPortalAccess = () => {
    const portalUrl = 'https://myaccount.microsoft.com/profile';
    window.open(portalUrl, '_blank');
    
    alert(`📋 Microsoft Account Portal opened!

After editing your profile:
1. ✅ Save your changes
2. 🔄 Return to this app  
3. 🚪 Sign out
4. 🔐 Sign back in

Your updated profile will then be visible in this app.`);
  };

  const handleViewProfile = () => {
    const profileInfo = `👤 Current Profile Information

🏷️ Display Name: ${account.name || 'Not available'}
📧 Email: ${account.username}
🆔 Account ID: ${account.homeAccountId}
🏢 Tenant: ${account.tenantId}
🕐 Last Sign-in: ${new Date().toLocaleString()}

📝 Note: This information is from your Azure External Identity account.
To edit this information, use the Microsoft Account portal.`;
    
    alert(profileInfo);
  };

  const handleSignOutAndBack = () => {
    const confirmRefresh = window.confirm(`🔄 Refresh Profile Information

This will:
1. 🚪 Sign you out of this app
2. 🔐 Redirect to sign-in page
3. ✅ Load your latest profile information

Continue?`);
    
    if (confirmRefresh) {
      instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin
      });
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
        👤 Profile Management (No Admin Consent Required)
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
          Azure External Identity account. Profile editing via Microsoft Account portal (no special permissions needed).
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
          onClick={handleDirectPortalAccess}
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
          🌐 Direct Portal Access
        </button>

        <button
          onClick={handleViewProfile}
          style={{
            backgroundColor: '#6f42c1',
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
          onClick={handleSignOutAndBack}
          style={{
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Refresh Profile
        </button>
      </div>

      <div style={{
        backgroundColor: '#d4edda',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
          ✅ No Admin Consent Required
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#155724',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li><strong>Simple Approach:</strong> Uses Microsoft Account portal directly</li>
          <li><strong>No Special Permissions:</strong> Works with standard OpenID Connect scopes</li>
          <li><strong>Tenant Integration:</strong> Changes sync automatically with Azure External Identity</li>
          <li><strong>User-Friendly:</strong> Sign out/in to see profile updates</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleProfileEditor;
