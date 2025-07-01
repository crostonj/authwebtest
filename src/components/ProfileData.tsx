import React from 'react';
import { useMsal } from '@azure/msal-react';

export const ProfileData: React.FC = () => {
  const { accounts } = useMsal();

  if (accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  return (
    <div style={{
      backgroundColor: '#f3f2f1',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0, color: '#323130' }}>Welcome!</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Name:</strong> {account.name || 'Not available'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Username:</strong> {account.username || 'Not available'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Account ID:</strong> {account.homeAccountId || 'Not available'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Environment:</strong> {account.environment || 'Not available'}
      </div>
      {account.idTokenClaims && (
        <details style={{ marginTop: '15px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            View ID Token Claims
          </summary>
          <pre style={{
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(account.idTokenClaims, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};
