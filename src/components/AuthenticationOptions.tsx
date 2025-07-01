import React, { useState } from 'react';
import { SignInButton } from './SignInButton';
import { SignUpButton } from './SignUpButton';
import { RegistrationForm } from './RegistrationForm';
import { ForgotPasswordButton } from './ForgotPasswordButton';
import { ExternalIdentityRegistration } from './ExternalIdentityRegistration';

export const AuthenticationOptions: React.FC = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showExternalIdentityHelp, setShowExternalIdentityHelp] = useState(false);

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <SignInButton />
          <SignUpButton />
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <ForgotPasswordButton />
        </div>
        
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <span style={{ color: '#605e5c', margin: '0 10px' }}>or</span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setShowRegistrationForm(true)}
            style={{
              backgroundColor: '#6c5ce7',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(108, 92, 231, 0.2)'
            }}
          >
            📝 Register with Form
          </button>
          
          <button
            onClick={() => setShowExternalIdentityHelp(true)}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
            }}
          >
            🆘 Having Issues?
          </button>
        </div>
        
        <div style={{
          textAlign: 'center',
          color: '#605e5c',
          fontSize: '14px',
          maxWidth: '500px',
          lineHeight: '1.4'
        }}>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Quick Sign-Up:</strong> Direct Azure registration • <strong>Form Registration:</strong> Pre-fill your details
          </p>
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e1f5fe',
          borderRadius: '8px',
          border: '1px solid #0288d1',
          maxWidth: '500px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#01579b' }}>
            🔐 Secure Registration Options
          </h4>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '20px', 
            color: '#0277bd',
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            <li><strong>Quick:</strong> Direct Azure External Identity registration</li>
            <li><strong>Form:</strong> Pre-fill details before Azure registration</li>
            <li><strong>Both:</strong> Email verification and secure passwords required</li>
            <li><strong>Instant:</strong> Immediate account activation upon completion</li>
          </ul>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <RegistrationForm onClose={() => setShowRegistrationForm(false)} />
          </div>
        </div>
      )}

      {/* External Identity Help Modal */}
      {showExternalIdentityHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <ExternalIdentityRegistration />
            <button
              onClick={() => setShowExternalIdentityHelp(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
