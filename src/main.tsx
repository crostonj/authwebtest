import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'
import { AuthErrorBoundary } from './components/AuthErrorBoundary'
import './index.css'
import App from './App.tsx'

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL and handle redirects
const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    
    // Handle redirects for popup authentication
    // This is crucial for popup flow to work correctly
    await msalInstance.handleRedirectPromise();
    
    console.log('✅ MSAL initialized successfully');
  } catch (error) {
    console.error('❌ MSAL initialization failed:', error);
  }
};

// Initialize MSAL before rendering
initializeMsal().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AuthErrorBoundary>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </AuthErrorBoundary>
    </StrictMode>,
  );
});
