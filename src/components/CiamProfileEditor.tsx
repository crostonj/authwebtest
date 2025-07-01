import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { getSafeProfileEditRequest } from '../authConfig';

interface UserProfile {
  displayName?: string;
  givenName?: string;
  surname?: string;
  // Remove fields that might not be editable in CIAM
  jobTitle?: string;
  // department?: string;  // Often not editable in CIAM
  // officeLocation?: string;  // Often not editable in CIAM
  // businessPhones?: string[];  // Often not editable in CIAM
  // mobilePhone?: string;  // Often not editable in CIAM
}

export const CiamProfileEditor: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({});
  const [originalProfile, setOriginalProfile] = useState<UserProfile>({});

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  // Get access token for Microsoft Graph
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const profileEditRequest = getSafeProfileEditRequest();
      const profileEditRequestWithAccount = {
        ...profileEditRequest,
        account: account
      };

      let response;
      try {
        response = await instance.acquireTokenSilent(profileEditRequestWithAccount);
        console.log('✅ Silent token acquisition successful');
      } catch (silentError: any) {
        console.log('ℹ️ Silent token acquisition failed, trying popup:', silentError.errorCode);
        response = await instance.acquireTokenPopup(profileEditRequestWithAccount);
      }

      return response.accessToken;
    } catch (error: any) {
      console.error('❌ Failed to get access token:', error);
      alert(`❌ Failed to get access token: ${error.errorCode || error.message}`);
      return null;
    }
  };

  // Fetch user profile from Microsoft Graph
  const fetchProfile = async (forceFresh: boolean = false) => {
    setIsLoading(true);
    try {
      if (forceFresh) {
        console.log('🔄 Forcing fresh token acquisition...');
      }
      
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Graph API Error: ${response.status} ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('✅ Profile fetched from Graph API:', userData);

      const profileData: UserProfile = {
        displayName: userData.displayName || '',
        givenName: userData.givenName || '',
        surname: userData.surname || '',
        jobTitle: userData.jobTitle || ''
      };

      setProfile(profileData);
      setOriginalProfile({ ...profileData });

    } catch (error: any) {
      console.error('❌ Failed to fetch profile:', error);
      alert(`❌ Failed to fetch profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test what we can read vs what we can write
  const testPermissions = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      // First test reading
      const readResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!readResponse.ok) {
        throw new Error(`Read failed: ${readResponse.status} ${readResponse.statusText}`);
      }

      const userData = await readResponse.json();
      console.log('✅ Can read user data:', userData);

      // Test write operation with typical profile fields
      const testPayload = {
        displayName: userData.displayName, // Same value, minimal change
        jobTitle: userData.jobTitle || 'Test Title' // Test if jobTitle is writable
      };

      const writeResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });

      if (writeResponse.ok) {
        alert(`✅ Write Permission Test Successful!

Read permissions: ✅ Working
Write permissions: ✅ Working (displayName, jobTitle)

Your CIAM tenant allows profile editing via Graph API.
You can edit: Display Name, Given Name, Surname, Job Title
Token scopes: ${getSafeProfileEditRequest().scopes.join(', ')}`);
      } else {
        const errorData = await writeResponse.json();
        
        if (errorData.error?.code === 'Authorization_RequestDenied') {
          alert(`❌ CIAM Write Permissions Restricted

Read permissions: ✅ Working  
Write permissions: ❌ Blocked by CIAM policy

Your Azure External Identity tenant has disabled profile editing via Graph API for security.

✅ Alternative Options:
1. Use Microsoft Account portal for profile editing
2. Contact your administrator to enable profile editing
3. Profile updates may need to be done through admin processes

This is normal for many CIAM configurations prioritizing security.`);
        } else {
          alert(`❌ Write Permission Test Failed

Read permissions: ✅ Working  
Write permissions: ❌ Failed (${writeResponse.status})

Error: ${errorData.error?.message || writeResponse.statusText}
Code: ${errorData.error?.code}

This CIAM tenant may have restricted write permissions.`);
        }
      }

    } catch (error: any) {
      console.error('❌ Permission test failed:', error);
      alert(`❌ Permission test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Microsoft Account portal for profile editing
  const openMicrosoftAccountPortal = () => {
    const portalUrl = 'https://myaccount.microsoft.com/profile';
    
    const confirmRedirect = window.confirm(`🌐 Microsoft Account Portal

Since your CIAM tenant restricts Graph API profile editing, you can use the Microsoft Account portal instead.

This will:
✅ Open Microsoft's official profile editing interface
✅ Allow you to edit your profile information
✅ Sync changes back to your Azure External Identity account

After editing:
1. Make your changes and save
2. Return to this app
3. Sign out and back in to see updates

Open Microsoft Account portal?`);
    
    if (confirmRedirect) {
      window.open(portalUrl, '_blank');
      
      // Show follow-up instructions
      setTimeout(() => {
        alert(`📋 After editing your profile in Microsoft Account portal:

1. ✅ Save your changes there
2. 🔄 Return to this app
3. 🚪 Sign out using the "Sign Out" button above
4. 🔐 Sign back in to refresh your profile

Your updated profile information will then be visible here.`);
      }, 1000);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      // Only try to update basic fields that are typically allowed in CIAM
      const updatePayload: any = {};
      
      if (profile.displayName !== originalProfile.displayName) {
        updatePayload.displayName = profile.displayName;
      }
      if (profile.givenName !== originalProfile.givenName) {
        updatePayload.givenName = profile.givenName;
      }
      if (profile.surname !== originalProfile.surname) {
        updatePayload.surname = profile.surname;
      }
      if (profile.jobTitle !== originalProfile.jobTitle) {
        updatePayload.jobTitle = profile.jobTitle;
      }

      if (Object.keys(updatePayload).length === 0) {
        alert('ℹ️ No changes detected. Nothing to update.');
        setIsEditing(false);
        return;
      }

      console.log('📝 Updating profile with minimal payload:', updatePayload);

      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Graph API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      console.log('✅ Profile updated successfully');
      
      setOriginalProfile({ ...profile });
      setIsEditing(false);

      alert(`✅ Profile updated successfully!

Updated fields: ${Object.keys(updatePayload).join(', ')}

Your profile changes are now saved in Azure External Identity.`);

    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      
      if (error.message?.includes('Authorization_RequestDenied')) {
        alert(`❌ Authorization Denied

Azure External Identity (CIAM) has restricted write permissions for user profiles.

Possible reasons:
- CIAM tenant configuration restricts user profile editing
- Additional admin consent required for write operations
- User profile fields are managed by the identity provider
- Write permissions not granted for this scope

Try using the Microsoft Account portal for profile editing instead.

Error: ${error.message}`);
      } else if (error.message?.includes('403')) {
        alert(`❌ Permission denied (403 error)

This CIAM tenant doesn't allow users to edit their own profiles via Graph API.

Error: ${error.message}`);
      } else {
        alert(`❌ Failed to update profile: ${error.message}

If this continues, try:
1. Click "Test Permissions" to check what's allowed
2. Use Microsoft Account portal for profile editing
3. Contact your administrator`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing and revert changes
  const cancelEditing = () => {
    setProfile({ ...originalProfile });
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

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
        ✏️ CIAM Profile Editor
      </h3>
      
      <div style={{
        backgroundColor: '#e7f3ff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #0078d4'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#004578' }}>
          Profile for: {account.name || account.username}
        </h4>
        <p style={{ margin: 0, color: '#106ebe', fontSize: '14px' }}>
          Azure External Identity compatible profile editing (limited fields)
        </p>
      </div>

      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#0078d4'
        }}>
          🔄 Loading profile data...
        </div>
      )}

      {!isLoading && Object.keys(profile).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gap: '15px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#323130' }}>
                Display Name
              </label>
              <input
                type="text"
                value={profile.displayName || ''}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d1d1',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f3f2f1',
                  color: isEditing ? '#323130' : '#605e5c'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#323130' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.givenName || ''}
                  onChange={(e) => handleInputChange('givenName', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d1d1',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f3f2f1',
                    color: isEditing ? '#323130' : '#605e5c'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#323130' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.surname || ''}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d1d1',
                    borderRadius: '4px',
                    backgroundColor: isEditing ? 'white' : '#f3f2f1',
                    color: isEditing ? '#323130' : '#605e5c'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#323130' }}>
                Job Title
              </label>
              <input
                type="text"
                value={profile.jobTitle || ''}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d1d1',
                  borderRadius: '4px',
                  backgroundColor: isEditing ? 'white' : '#f3f2f1',
                  color: isEditing ? '#323130' : '#605e5c'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginTop: '25px',
            flexWrap: 'wrap'
          }}>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
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
                  ✏️ Edit Profile
                </button>

                <button
                  onClick={() => fetchProfile(true)}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#6f42c1',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  🔄 Refresh Profile
                </button>

                <button
                  onClick={testPermissions}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  🧪 Test Permissions
                </button>

                <button
                  onClick={openMicrosoftAccountPortal}
                  style={{
                    backgroundColor: '#ff6900',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  🌐 Microsoft Portal
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={updateProfile}
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  {isLoading ? '🔄 Saving...' : '💾 Save Changes'}
                </button>

                <button
                  onClick={cancelEditing}
                  disabled={isLoading}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: '#fff3cd',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          ⚠️ Azure External Identity (CIAM) Profile Editing
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#856404',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li><strong>Editable Fields:</strong> Display Name, First Name, Last Name, Job Title</li>
          <li><strong>Test First:</strong> Use "Test Permissions" to check what your tenant allows</li>
          <li><strong>CIAM Varies:</strong> Different tenants may have different restrictions</li>
          <li><strong>Alternative:</strong> Use Microsoft Account portal if Graph API editing is restricted</li>
        </ul>
      </div>
    </div>
  );
};

export default CiamProfileEditor;
