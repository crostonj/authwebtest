import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

/**
 * Helper function to get the correct redirect URI
 * Uses the URIs that are actually registered in your Azure app
 */
const getRedirectUri = () => {
  const envUri = import.meta.env.VITE_REDIRECT_URI;
  if (envUri) {
    console.log('🔧 Using .env redirect URI:', envUri);
    return envUri;
  }
  
  // Your registered URIs in Azure (in order of preference for development):
  // http://localhost:3000/, http://localhost:3000, https://localhost:3000/, https://localhost:3000
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const registeredUris = [
    'http://localhost:3000/',    // HTTP with slash (development friendly)
    'http://localhost:3000',     // HTTP without slash
    'https://localhost:3000/',   // HTTPS with slash (production)
    'https://localhost:3000',    // HTTPS without slash
  ];
  
  // Try to match current origin with registered URIs
  const currentWithSlash = `${origin}/`;
  const currentWithoutSlash = origin;
  
  if (registeredUris.includes(currentWithSlash)) {
    console.log('🔧 Using current origin with slash:', currentWithSlash);
    return currentWithSlash;
  } else if (registeredUris.includes(currentWithoutSlash)) {
    console.log('🔧 Using current origin without slash:', currentWithoutSlash);
    return currentWithoutSlash;
  } else {
    // Fallback to development-friendly HTTP URI
    console.log('🔧 Using fallback HTTP URI:', 'http://localhost:3000/');
    return 'http://localhost:3000/';
  }
};

// Azure External Identity configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'dc245087-4913-4425-a15b-35b672d7b98f', // This is the ONLY mandatory field
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com', // Azure External Identity authority
    redirectUri: getRedirectUri(), // Must be registered as a redirect URI with your application
    postLogoutRedirectUri: getRedirectUri(), // Must be registered as a redirect URI with your application
  },
  cache: {
    cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

/**
 * Standard Azure External Identity login request
 * This ensures only Azure External Identity authentication is used
 */
export const loginRequest = {
  scopes: ['openid', 'profile', 'email']
};

/**
 * Registration request for Azure External Identity sign-up flow
 * This forces Azure External Identity registration only
 */
export const registrationRequest = {
  scopes: ['openid', 'profile', 'email'],
  prompt: 'create' as const // Forces the registration/sign-up flow
};

/**
 * Sign-up request specifically for new user registration
 * You can customize this based on your Azure External Identity user flow configuration
 */
export const signUpRequest = {
  scopes: ['openid', 'profile', 'email']
};

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
export const silentRequest = {
  scopes: ['openid', 'profile', 'email']
};

/**
 * Password reset request for Azure External Identity
 * This can be configured to use specific user flows for password reset
 */
export const passwordResetRequest = {
  scopes: ['openid', 'profile', 'email']
};

/**
 * Profile edit request for Azure External Identity
 * Uses Microsoft Graph API with CIAM-compatible scopes
 * Azure External Identity may have restricted write permissions
 */
export const profileEditRequest = {
  scopes: ['openid', 'profile', 'email', 'User.ReadWrite'],
  extraQueryParameters: {
    // Azure External Identity specific parameters
    'domain_hint': 'consumers' // Hint for consumer accounts in External Identity
  }
};

/**
 * User flow configuration helpers
 * These can be used to build authority URLs for specific flows
 */
export const getUserFlowAuthority = (flow: string) => {
  const baseAuthority = import.meta.env.VITE_AZURE_AUTHORITY || 'https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com';
  return `${baseAuthority}/${flow}`;
};

/**
 * Get sign-up specific authority if using dedicated user flows
 */
export const getSignUpAuthority = () => {
  const signUpFlow = import.meta.env.VITE_AZURE_SIGNUP_FLOW;
  return signUpFlow ? getUserFlowAuthority(signUpFlow) : msalConfig.auth.authority;
};

/**
 * Get password reset specific authority if using dedicated user flows
 */
export const getPasswordResetAuthority = () => {
  const resetFlow = import.meta.env.VITE_AZURE_RESET_PASSWORD_FLOW;
  return resetFlow ? getUserFlowAuthority(resetFlow) : msalConfig.auth.authority;
};

/**
 * Get profile edit specific authority if using dedicated user flows
 * For Azure External Identity with Graph API permissions
 */
export const getProfileEditAuthority = (): string | null => {
  // Azure External Identity with Graph API permissions
  // Uses the main authority with proper scopes
  const profileEditAuthority = import.meta.env.VITE_AZURE_PROFILE_EDIT_AUTHORITY;
  if (profileEditAuthority) {
    return profileEditAuthority;
  }
  
  // For Azure External Identity, we use the main authority with Graph API scopes
  return msalConfig.auth.authority || null;
};

/**
 * Check if profile editing is available in this tenant
 * For Azure External Identity with Graph API permissions
 */
export const isProfileEditingAvailable = (): boolean => {
  // Azure External Identity supports profile editing through Graph API
  // Admin consent has been granted
  return true;
};

/**
 * Get a safe profile edit request for Azure External Identity
 * Uses Graph API approach with admin consent granted
 */
export const getSafeProfileEditRequest = () => {
  // For Azure External Identity, we use Graph API permissions
  // Admin consent has been granted for User.ReadWrite
  return {
    ...profileEditRequest,
    authority: msalConfig.auth.authority
  };
};

/**
 * Debug helper to log current configuration
 * Remove this in production
 */
const logConfiguration = () => {
  console.log('🔧 MSAL Configuration Debug:', {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'dc245087-4913-4425-a15b-35b672d7b98f',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com',
    redirectUri: getRedirectUri(),
    currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'SSR mode'
  });
};

// Log configuration in development
if (import.meta.env.DEV) {
  setTimeout(logConfiguration, 1000); // Log after DOM loads
}
