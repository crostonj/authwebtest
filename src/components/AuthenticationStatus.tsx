import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { SignOutButton } from './SignOutButton';
import { ProfileData } from './ProfileData';
import { CiamProfileEditor } from './CiamProfileEditor';
import { AuthenticationOptions } from './AuthenticationOptions';

export const AuthenticationStatus: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#323130', marginBottom: '30px' }}>
        Azure External Identity Demo
      </h1>
      
      <div style={{
        backgroundColor: isAuthenticated ? '#dff6dd' : '#fff4ce',
        border: `2px solid ${isAuthenticated ? '#107c10' : '#ffb900'}`,
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: isAuthenticated ? '#107c10' : '#d83b01',
          margin: '0 0 10px 0'
        }}>
          {isAuthenticated ? '✓ Authenticated' : '⚠ Not Authenticated'}
        </h2>
        <p style={{ margin: 0, color: '#323130' }}>
          {isAuthenticated 
            ? 'You are successfully signed in with Azure External Identity!'
            : 'Please sign in to access your account.'
          }
        </p>
      </div>

      {isAuthenticated ? (
        <div>
          <SignOutButton />
          <ProfileData />
          <CiamProfileEditor />
        </div>
      ) : (
        <div>
          <AuthenticationOptions />
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#323130', marginTop: 0 }}>Setup Instructions:</h3>
            <ol style={{ color: '#605e5c', lineHeight: '1.6' }}>
              <li>Configure your Azure External Identity tenant</li>
              <li>Register this application in your Azure portal</li>
              <li>Update the configuration in <code>.env</code> file</li>
              <li>Set the redirect URIs in Azure to match your application URLs</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
