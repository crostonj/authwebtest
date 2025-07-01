import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';

export const AzureProfileEditor: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  const handleEditProfileInTenant = async () => {
    setIsLoading(true);
    
    try {
      // Try to use Azure External Identity profile edit flow within the current tenant
      const profileEditRequest = {
        scopes: ['openid', 'profile', 'email'],
        authority: `${import.meta.env.VITE_AZURE_AUTHORITY || 'https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com'}/B2C_1_ProfileEdit`,
        prompt: 'login' as const,
        account: account,
        extraQueryParameters: {
          'ui_action': 'ProfileEdit'
        }
      };

      const response = await instance.loginPopup(profileEditRequest);
      console.log('✅ Tenant profile edit successful:', response);
      
      alert(`✅ Profile updated in Azure External Identity!

Your profile has been updated within the ${import.meta.env.VITE_AZURE_AUTHORITY || 'crostonext1'} tenant.
Changes are immediately available in this application.`);
      
    } catch (error: any) {
      console.error('❌ Tenant profile edit failed:', error);
      
      if (error.errorCode === 'user_cancelled') {
        return;
      }
      
      // If the profile edit flow doesn't exist, provide instructions
      if (error.errorMessage?.includes('policy_not_found') || error.errorMessage?.includes('AADB2C90023')) {
        const setupInstructions = `❌ Profile Editing Not Available

This Azure External Identity tenant doesn't have profile editing configured.

📋 Administrator Setup Required:
1. Go to Azure Portal → External Identities
2. Create User Flow → Profile editing
3. Configure flow ID as "B2C_1_ProfileEdit"
4. Enable attributes users can edit
5. Save and publish the flow

🔄 Alternative Solutions:
- Contact administrator to update your profile
- Use Microsoft Graph API integration
- Request a new account with correct information

Would you like detailed setup instructions?`;
        
        const showDetails = window.confirm(setupInstructions);
        if (showDetails) {
          showDetailedSetupGuide();
        }
        return;
      }
      
      alert(`❌ Profile editing failed: ${error.errorCode || error.message}

This Azure External Identity tenant may not have profile editing enabled.
Contact your administrator for assistance.`);
    } finally {
      setIsLoading(false);
    }
  };

  const showDetailedSetupGuide = () => {
    const guide = `📋 Detailed Profile Edit Setup for Azure External Identity

ADMINISTRATOR INSTRUCTIONS:

1. 🔧 Azure Portal Configuration:
   - Navigate to Azure Portal → External Identities
   - Select your tenant: ${import.meta.env.VITE_AZURE_AUTHORITY || 'crostonext1.ciamlogin.com'}
   - Go to "User flows" section

2. 📝 Create Profile Edit Flow:
   - Click "New user flow"
   - Select "Profile editing"
   - Choose "Recommended" version
   - Name: "B2C_1_ProfileEdit" (exactly)

3. ✅ Configure Attributes:
   - User attributes to collect: Display Name, Email
   - Application claims to return: Display Name, Email, Object ID
   - Customize page layouts if needed

4. 🎨 UI Customization (Optional):
   - Upload custom HTML/CSS
   - Configure branding
   - Set custom error messages

5. 💾 Save and Test:
   - Save the user flow
   - Test with a user account
   - Verify claims are returned correctly

DEVELOPER INTEGRATION:
- The profile edit authority will be: ${import.meta.env.VITE_AZURE_AUTHORITY || 'https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com'}/B2C_1_ProfileEdit
- Use MSAL loginPopup with this authority
- Handle success/error responses appropriately

For Microsoft Graph API integration, additional permissions and configuration are required.`;
    
    alert(guide);
  };

  const handleViewCurrentProfile = () => {
    const profileInfo = `👤 Current Profile Information

🏷️ Display Name: ${account.name || 'Not available'}
📧 Email: ${account.username}
🆔 Account ID: ${account.homeAccountId}
🏢 Tenant: ${account.tenantId}
🕐 Last Login: ${new Date().toLocaleString()}

📝 Note: This information is from your Azure External Identity account in the ${import.meta.env.VITE_AZURE_AUTHORITY || 'crostonext1'} tenant.

To edit this information, a profile editing flow must be configured by your administrator.`;
    
    alert(profileInfo);
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      margin: '20px 0',
      border: '2px solid #0078d4',
      maxWidth: '600px'
    }}>
      <h3 style={{ 
        color: '#0078d4', 
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        👤 Profile Management
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
          Logged in to Azure External Identity tenant. 
          Profile editing must be configured by your administrator.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleEditProfileInTenant}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Loading...' : '✏️ Edit Profile in Tenant'}
        </button>

        <button
          onClick={handleViewCurrentProfile}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          👁️ View Profile Info
        </button>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          ℹ️ About Profile Editing
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#856404',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li><strong>Tenant-Specific:</strong> Your profile is managed within this Azure External Identity tenant</li>
          <li><strong>Not Microsoft Account:</strong> Changes here won't affect your personal Microsoft account</li>
          <li><strong>Administrator Setup:</strong> Profile editing requires configuration by tenant administrators</li>
          <li><strong>Secure:</strong> All changes are validated and stored securely in Azure</li>
        </ul>
      </div>
    </div>
  );
};

export default AzureProfileEditor;
