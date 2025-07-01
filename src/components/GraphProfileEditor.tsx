import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { getSafeProfileEditRequest } from '../authConfig';

interface UserProfile {
  displayName?: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  businessPhones?: string[];
  mobilePhone?: string;
}

export const GraphProfileEditor: React.FC = () => {
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
      // Clear stored token if forcing fresh fetch
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
        jobTitle: userData.jobTitle || '',
        department: userData.department || '',
        officeLocation: userData.officeLocation || '',
        businessPhones: userData.businessPhones || [],
        mobilePhone: userData.mobilePhone || ''
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

  // Update user profile using Microsoft Graph
  const updateProfile = async () => {
    setIsLoading(true);
    try {
      // Always get a fresh token before updating to avoid 403 errors
      const token = await getAccessToken();
      if (!token) {
        return;
      }
      // Prepare update payload (only changed fields)
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
      if (profile.department !== originalProfile.department) {
        updatePayload.department = profile.department;
      }
      if (profile.officeLocation !== originalProfile.officeLocation) {
        updatePayload.officeLocation = profile.officeLocation;
      }
      if (profile.mobilePhone !== originalProfile.mobilePhone) {
        updatePayload.mobilePhone = profile.mobilePhone;
      }

      if (Object.keys(updatePayload).length === 0) {
        alert('ℹ️ No changes detected. Nothing to update.');
        setIsEditing(false);
        return;
      }

      console.log('📝 Updating profile with:', updatePayload);

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
      
      // Update original profile to reflect changes
      setOriginalProfile({ ...profile });
      setIsEditing(false);

      alert(`✅ Profile updated successfully!

Updated fields: ${Object.keys(updatePayload).join(', ')}

Your profile changes are now saved in Azure External Identity.`);

    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      
      if (error.message?.includes('403')) {
        alert(`❌ Permission denied (403 error)

This usually means:
- Your access token has expired
- Additional permissions are needed
- The admin consent may need to be refreshed

Try refreshing your profile first, or sign out and back in.

Error: ${error.message}`);
      } else {
        alert(`❌ Failed to update profile: ${error.message}

If this continues, try:
1. Click "Refresh Profile" to get a new token
2. Sign out and back in
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
        ✏️ Edit Your Profile
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
          Edit your profile information directly using Microsoft Graph API
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#323130' }}>
                  Department
                </label>
                <input
                  type="text"
                  value={profile.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
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
                  Office Location
                </label>
                <input
                  type="text"
                  value={profile.officeLocation || ''}
                  onChange={(e) => handleInputChange('officeLocation', e.target.value)}
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
                Mobile Phone
              </label>
              <input
                type="tel"
                value={profile.mobilePhone || ''}
                onChange={(e) => handleInputChange('mobilePhone', e.target.value)}
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
            marginTop: '25px'
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
        backgroundColor: '#d4edda',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
          ✅ Microsoft Graph API Profile Editing
        </h4>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#155724',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <li><strong>Real-Time Updates:</strong> Changes are immediately saved to Azure External Identity</li>
          <li><strong>No Re-Authentication:</strong> Uses silent token acquisition with admin consent</li>
          <li><strong>Full Graph API:</strong> Direct integration with Microsoft Graph for profile management</li>
          <li><strong>Change Detection:</strong> Only modified fields are sent to the API</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphProfileEditor;
