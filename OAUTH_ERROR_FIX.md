# OAuth Error Troubleshooting Guide

## Problem Description
You're seeing an OAuth authorization error with the URL pattern:
```
/pp1600/oauth20_authorize.srf?scope=openid+profile+email+offline_access&response_type=code&client_id=...
```

This indicates that the authentication flow is being redirected to Microsoft's OAuth endpoint instead of staying within Azure External Identity.

## Root Causes

### 1. **Azure External Identity Configuration**
Your Azure External Identity tenant might have social identity providers (Microsoft, Google, etc.) configured, causing automatic redirects.

### 2. **Cached Authentication State**
Previous authentication attempts with social providers might be cached in the browser.

### 3. **Login Hints**
The error URL shows `login_hint=crostonj%40gmail.com`, which suggests the system is trying to use a specific email that might trigger social provider detection.

## Solution Steps

### Step 1: Use the OAuth Error Fixer
The app now includes an OAuth Error Fixer component with these tools:

1. **🧹 Clear All Auth Data** - Removes all MSAL cache, session storage, and localStorage auth data
2. **🚪 Force Logout** - Logs out from all accounts and clears cache
3. **🔍 Get Debug Info** - Shows current authentication configuration
4. **🚨 Check OAuth Errors** - Analyzes current URL for OAuth error patterns

### Step 2: Clear Browser State
1. Click "Clear All Auth Data" in the OAuth Error Fixer
2. Refresh the page
3. Try authentication again

### Step 3: Test in Incognito Mode
1. Open a private/incognito browser window
2. Navigate to your app
3. Try authentication without any cached data

### Step 4: Azure External Identity Configuration
Check your Azure External Identity tenant configuration:

1. **Go to Azure Portal** → **Azure AD B2C** (or **External Identities**)
2. **Navigate to Identity Providers**
3. **Remove or disable** any social identity providers:
   - Microsoft Account
   - Google
   - Facebook
   - GitHub
   - Any other social providers

4. **Keep only**:
   - Email signup
   - Local account providers
   - Azure AD (if needed for organization accounts)

### Step 5: User Flow Configuration
If using custom user flows:

1. **Go to User Flows** in Azure Portal
2. **Edit your sign-up/sign-in flow**
3. **Remove social identity providers** from the flow
4. **Keep only local account options**

### Step 6: App Registration Settings
Check your app registration:

1. **Go to App Registrations** in Azure Portal
2. **Find your app** (`dc245087-4913-4425-a15b-35b672d7b98f`)
3. **Check Authentication** settings
4. **Ensure redirect URIs** are correctly configured:
   - `http://localhost:3000/` ✅
   - `http://localhost:3000` ✅
   - `https://localhost:3000/` ✅
   - `https://localhost:3000` ✅

## Testing the Fix

### 1. Clear Everything
```javascript
// Open browser console and run:
clearAuthData();
```

### 2. Test Authentication
```javascript
// In browser console:
testAuthFlow();
```

### 3. Check for Errors
```javascript
// In browser console:
checkOAuthErrors();
```

## Advanced Debugging

### Console Commands
The app exposes these global debugging functions:

```javascript
// Clear all authentication data
window.clearAuthData();

// Get detailed debug information
window.getAuthDebugInfo();

// Test authentication flow
window.testAuthFlow();

// Force logout from all accounts
window.forceLogout();

// Check current URL for OAuth errors
window.checkOAuthErrors();
```

### Manual Cache Clearing
If automated clearing doesn't work:

1. **Open Developer Tools** (F12)
2. **Go to Application/Storage tab**
3. **Clear**:
   - Local Storage (all msal/azure/auth keys)
   - Session Storage (everything)
   - Cookies (all auth-related)
   - IndexedDB (if any MSAL data)

## Expected Behavior After Fix

1. **No social login options** should appear
2. **Registration/Sign-in** should use only Azure External Identity
3. **No redirects** to `oauth20_authorize.srf` or social provider URLs
4. **Authentication flow** should stay within your Azure External Identity tenant

## Alternative Solutions

### If Issues Persist

1. **Create a new Azure External Identity tenant** without social providers
2. **Use a different client ID** for testing
3. **Test with different email addresses** that don't trigger social provider hints
4. **Check Azure tenant settings** for global social provider configurations

## Contact Support

If the issue persists after following these steps:

1. **Provide the debug information** from `getAuthDebugInfo()`
2. **Include OAuth error details** from `checkOAuthErrors()`
3. **Share Azure tenant configuration** (without sensitive data)
4. **Test results** from incognito mode

The OAuth Error Fixer component will help you gather all necessary debugging information.
