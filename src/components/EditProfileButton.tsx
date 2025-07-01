import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { isProfileEditingAvailable, getSafeProfileEditRequest } from '../authConfig';

interface EditProfileButtonProps {
  className?: string;
}

export const EditProfileButton: React.FC<EditProfileButtonProps> = ({ className }) => {
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = async () => {
    setIsLoading(true);
    
    try {
      // Check if profile editing is configured in this tenant
      if (!isProfileEditingAvailable()) {
        alert(`❌ Profile editing is not configured in this Azure External Identity tenant.

Administrator Setup Required:
1. Go to Azure Portal → External Identities → User flows
2. Create a new user flow of type "Profile editing"
3. Name it "B2C_1_ProfileEdit"
4. Configure the attributes users can edit
5. Save and test

Alternative: Contact your administrator to update your profile manually.`);
        return;
      }

      // Use the safe profile edit request to avoid endpoints_resolution_error
      const profileEditRequest = getSafeProfileEditRequest();

      console.log('🔧 Attempting profile edit with request:', profileEditRequest);

      const response = await instance.loginPopup(profileEditRequest);
      console.log('✅ Profile edit successful:', response);
      
      alert(`✅ Profile updated successfully!

Your profile changes have been saved in Azure External Identity.
The changes will be reflected immediately in this application.`);
      
    } catch (error: any) {
      console.error('❌ Profile edit failed:', error);
      
      // Handle specific Azure External Identity errors
      if (error.errorCode === 'user_cancelled') {
        // User cancelled - no action needed
        return;
      }
      
      if (error.errorCode === 'endpoints_resolution_error') {
        alert(`❌ Profile editing user flow not found

This Azure External Identity tenant doesn't have a profile edit user flow configured.

Administrator Setup Required:
1. Go to Azure Portal → External Identities
2. Create User Flow → Profile editing
3. Name it "B2C_1_ProfileEdit" (exactly)
4. Configure attributes users can edit
5. Save and test the flow

Contact your administrator to set this up.`);
        return;
      }
      
      if (error.errorMessage?.includes('AADB2C90118') || error.errorCode === 'access_denied') {
        alert('Profile editing was cancelled.');
        return;
      }
      
      // If profile edit flow doesn't exist, offer alternatives
      if (error.errorMessage?.includes('AADB2C90023') || error.errorMessage?.includes('policy_not_found')) {
        const fallbackOptions = `❌ Profile Edit Flow Not Configured

Your Azure External Identity tenant doesn't have a profile edit user flow configured.

Alternative options:
1. 📝 Request administrator to create a profile edit flow
2. 🔄 Contact support to update your profile
3. 🔐 Create a new account with correct information

Would you like to learn how to configure profile editing?`;
        
        const showInstructions = window.confirm(fallbackOptions);
        if (showInstructions) {
          showProfileEditInstructions();
        }
        return;
      }
      
      // Generic error handling
      alert(`❌ Profile editing failed

Error: ${error.errorCode || error.message}

This might happen if:
- Profile editing is not enabled in your Azure External Identity tenant
- You don't have permission to edit your profile
- There's a temporary service issue

Please try again later or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const showProfileEditInstructions = () => {
    const instructions = `📋 Setting Up Profile Editing in Azure External Identity

To enable profile editing for users, an administrator needs to:

1. 🔧 Go to Azure Portal → External Identities
2. 📝 Create a new User Flow of type "Profile editing"
3. 🎯 Configure the flow with ID "B2C_1_ProfileEdit"
4. ✅ Include attributes users can edit (display name, etc.)
5. 🎨 Customize the UI if needed
6. 💾 Save and activate the flow

Alternative: Use Microsoft Graph API for programmatic profile updates.

For now, users will need to contact administrators to update their profiles.`;
    
    alert(instructions);
  };

  return (
    <button 
      onClick={handleEditProfile}
      disabled={isLoading}
      className={className}
      style={{
        backgroundColor: isLoading ? '#6c757d' : '#17a2b8',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        opacity: isLoading ? 0.6 : 1,
        ...(!className && { margin: '10px' })
      }}
    >
      {isLoading ? '🔄 Loading...' : '✏️ Edit Profile'}
    </button>
  );
};

export default EditProfileButton;
