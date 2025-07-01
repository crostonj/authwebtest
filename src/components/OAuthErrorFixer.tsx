import React, { useState } from 'react';
import { authDebugger } from '../utils/authDebugger';

export const OAuthErrorFixer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClearAuthData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await authDebugger.clearAllAuthData();
      if (success) {
        alert('✅ All authentication data cleared! Please refresh the page and try again.');
        window.location.reload();
      } else {
        setError('Failed to clear authentication data');
      }
    } catch (err) {
      setError('Error clearing authentication data: ' + String(err));
    }
    
    setIsLoading(false);
  };

  const handleForceLogout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await authDebugger.forceLogout();
      if (success) {
        alert('✅ Force logout completed! Page will refresh.');
        window.location.reload();
      } else {
        setError('Failed to force logout');
      }
    } catch (err) {
      setError('Error during force logout: ' + String(err));
    }
    
    setIsLoading(false);
  };

  const handleGetDebugInfo = () => {
    try {
      const info = authDebugger.getAuthDebugInfo();
      setDebugInfo(info);
      setError(null);
    } catch (err) {
      setError('Error getting debug info: ' + String(err));
    }
  };

  const handleCheckOAuthErrors = () => {
    try {
      const errors = authDebugger.checkForOAuthErrors();
      setDebugInfo({ oauthErrors: errors });
      setError(null);
    } catch (err) {
      setError('Error checking OAuth errors: ' + String(err));
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#856404', marginTop: 0 }}>
        🚨 OAuth Error Troubleshooter
      </h3>
      
      <p style={{ color: '#856404', marginBottom: '20px' }}>
        If you're seeing OAuth errors or being redirected to Microsoft/Google login pages,
        this tool can help clear cached authentication data and troubleshoot the issue.
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleClearAuthData}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Clearing...' : '🧹 Clear All Auth Data'}
        </button>

        <button
          onClick={handleForceLogout}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Logging out...' : '🚪 Force Logout'}
        </button>

        <button
          onClick={handleGetDebugInfo}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔍 Get Debug Info
        </button>

        <button
          onClick={handleCheckOAuthErrors}
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6610f2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🚨 Check OAuth Errors
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '10px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {debugInfo && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <h4 style={{ marginTop: 0, color: '#0c5460' }}>Debug Information:</h4>
          <pre style={{ 
            fontSize: '12px',
            color: '#0c5460',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginTop: 0, color: '#155724' }}>💡 Troubleshooting Steps:</h4>
        <ol style={{ color: '#155724', marginBottom: 0 }}>
          <li><strong>Clear Auth Data:</strong> Remove all cached authentication information</li>
          <li><strong>Force Logout:</strong> Logout from all accounts and clear cache</li>
          <li><strong>Refresh Page:</strong> Reload the application after clearing data</li>
          <li><strong>Check Azure Config:</strong> Ensure no social identity providers are configured</li>
          <li><strong>Try Incognito:</strong> Test in a private browsing window</li>
        </ol>
      </div>
    </div>
  );
};

export default OAuthErrorFixer;
