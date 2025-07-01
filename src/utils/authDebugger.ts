/**
 * Azure External Identity Authentication Debugger
 * Helper utilities to troubleshoot authentication issues
 */

import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';

export class AuthDebugger {
  private instance: PublicClientApplication;

  constructor() {
    this.instance = new PublicClientApplication(msalConfig);
  }

  /**
   * Clear all authentication caches and storage
   */
  async clearAllAuthData() {
    try {
      console.log('🧹 Clearing all authentication data...');

      // Clear MSAL cache
      await this.instance.clearCache();

      // Clear session storage
      sessionStorage.clear();

      // Clear local storage (auth-related items)
      const authKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('msal') || 
          key.includes('azure') || 
          key.includes('oauth') ||
          key.includes('auth')
        )) {
          authKeys.push(key);
        }
      }
      
      authKeys.forEach(key => localStorage.removeItem(key));

      console.log('✅ All authentication data cleared');
      console.log('📋 Cleared items:', {
        msalCache: 'cleared',
        sessionStorage: 'cleared',
        localStorageAuthKeys: authKeys
      });

      return true;
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
      return false;
    }
  }

  /**
   * Get current authentication debug information
   */
  getAuthDebugInfo() {
    const debugInfo = {
      msalConfig: {
        clientId: msalConfig.auth.clientId,
        authority: msalConfig.auth.authority,
        redirectUri: msalConfig.auth.redirectUri,
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
      },
      currentUrl: window.location.href,
      currentOrigin: window.location.origin,
      userAgent: navigator.userAgent,
      cookies: document.cookie,
      sessionStorageKeys: Object.keys(sessionStorage),
      localStorageKeys: Object.keys(localStorage).filter(key => 
        key.includes('msal') || key.includes('azure') || key.includes('auth')
      ),
      accounts: this.instance.getAllAccounts(),
      activeAccount: this.instance.getActiveAccount()
    };

    console.log('🔍 Authentication Debug Info:', debugInfo);
    return debugInfo;
  }

  /**
   * Test basic authentication flow
   */
  async testAuthFlow() {
    try {
      console.log('🧪 Testing authentication flow...');
      
      const result = await this.instance.loginPopup({
        scopes: ['openid', 'profile', 'email'],
        prompt: 'select_account' // Force account selection
      });

      console.log('✅ Auth flow test successful:', result);
      return { success: true, result };
    } catch (error) {
      console.error('❌ Auth flow test failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Force logout and clear everything
   */
  async forceLogout() {
    try {
      console.log('🚪 Force logout...');
      
      // Try to logout all accounts
      const accounts = this.instance.getAllAccounts();
      for (const account of accounts) {
        try {
          await this.instance.logoutPopup({ account });
        } catch (logoutError) {
          console.warn('⚠️ Could not logout account:', account.username, logoutError);
        }
      }

      // Clear all auth data
      await this.clearAllAuthData();

      console.log('✅ Force logout completed');
      return true;
    } catch (error) {
      console.error('❌ Force logout failed:', error);
      return false;
    }
  }

  /**
   * Check for OAuth error URLs and extract information
   */
  checkForOAuthErrors() {
    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);

    const errors = {
      hasError: false,
      errorCode: null as string | null,
      errorDescription: null as string | null,
      state: null as string | null,
      urlAnalysis: {
        fullUrl: url,
        containsOAuth: url.includes('oauth'),
        containsMicrosoft: url.includes('microsoft') || url.includes('live.com'),
        containsGoogle: url.includes('google'),
        suspiciousPatterns: [] as string[]
      }
    };

    // Check for OAuth error patterns
    if (url.includes('oauth20_authorize.srf')) {
      errors.hasError = true;
      errors.urlAnalysis.suspiciousPatterns.push('Microsoft OAuth endpoint detected');
    }

    if (url.includes('accounts.google.com')) {
      errors.hasError = true;
      errors.urlAnalysis.suspiciousPatterns.push('Google OAuth endpoint detected');
    }

    // Extract error parameters
    errors.errorCode = urlParams.get('error') || urlParams.get('error_code');
    errors.errorDescription = urlParams.get('error_description');
    errors.state = urlParams.get('state');

    if (errors.hasError || errors.errorCode) {
      console.error('🚨 OAuth Error Detected:', errors);
    }

    return errors;
  }
}

// Export singleton instance
export const authDebugger = new AuthDebugger();

// Global debug functions for browser console
if (typeof window !== 'undefined') {
  (window as any).authDebugger = authDebugger;
  (window as any).clearAuthData = () => authDebugger.clearAllAuthData();
  (window as any).getAuthDebugInfo = () => authDebugger.getAuthDebugInfo();
  (window as any).testAuthFlow = () => authDebugger.testAuthFlow();
  (window as any).forceLogout = () => authDebugger.forceLogout();
  (window as any).checkOAuthErrors = () => authDebugger.checkForOAuthErrors();
}
