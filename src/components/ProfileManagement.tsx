import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { EditProfileButton } from './EditProfileButton';

export const ProfileManagement: React.FC = () => {
  const { accounts, instance } = useMsal();
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  const handleRefreshProfile = async () => {
    try {
      // Silently acquire a new token to get updated profile information
      const silentRequest = {
        scopes: ['openid', 'profile', 'email'],
        account: account
      };
      
      const response = await instance.acquireTokenSilent(silentRequest);
      console.log('Profile refreshed:', response);
      
      // Force a re-render or page refresh to show updated info
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // If silent refresh fails, try interactive
      const interactiveRequest = {
        scopes: ['openid', 'profile', 'email'],
        account: account
      };
      instance.acquireTokenPopup(interactiveRequest);
    }
  };

  const getProfileValue = (claim: string) => {
    if (account.idTokenClaims) {
      return (account.idTokenClaims as any)[claim] || 'Not available';
    }
    return 'Not available';
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '25px',
      borderRadius: '12px',
      margin: '20px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#495057',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          👤 Profile Management
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <EditProfileButton />
          <button
            onClick={handleRefreshProfile}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Basic Information</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Display Name:</strong> {account.name || 'Not available'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Email:</strong> {account.username || 'Not available'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>First Name:</strong> {getProfileValue('given_name')}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Last Name:</strong> {getProfileValue('family_name')}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>Account Details</h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>Account ID:</strong> 
            <span style={{ fontSize: '12px', color: '#6c757d', wordBreak: 'break-all' }}>
              {account.homeAccountId || 'Not available'}
            </span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Tenant:</strong> {getProfileValue('tid')}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Object ID:</strong> 
            <span style={{ fontSize: '12px', color: '#6c757d' }}>
              {getProfileValue('oid')}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ margin: 0, color: '#495057' }}>Profile Actions</h4>
        <button
          onClick={() => setShowProfileDetails(!showProfileDetails)}
          style={{
            backgroundColor: 'transparent',
            color: '#6c757d',
            border: '1px solid #dee2e6',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {showProfileDetails ? 'Hide Details' : 'Show All Claims'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>✏️</div>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>Edit Profile</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Update your personal information
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff3e0',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔒</div>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>Change Password</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Update your account password
          </div>
        </div>

        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '15px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>📧</div>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>Email Settings</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Manage email preferences
          </div>
        </div>
      </div>

      {showProfileDetails && account.idTokenClaims && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ 
            cursor: 'pointer', 
            fontWeight: 'bold',
            padding: '10px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px'
          }}>
            🔍 All Profile Claims
          </summary>
          <pre style={{
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '300px',
            border: '1px solid #dee2e6'
          }}>
            {JSON.stringify(account.idTokenClaims, null, 2)}
          </pre>
        </details>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#d1ecf1',
        borderRadius: '6px',
        border: '1px solid #bee5eb'
      }}>
        <h5 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
          💡 Profile Management Tips
        </h5>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px',
          color: '#0c5460',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          <li><strong>Edit Profile:</strong> Updates your display name, email, and other details</li>
          <li><strong>Refresh:</strong> Gets the latest profile information from Azure</li>
          <li><strong>Security:</strong> All changes are processed securely through Azure External Identity</li>
        </ul>
      </div>
    </div>
  );
};
