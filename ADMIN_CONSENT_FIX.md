# Azure External Identity - Admin Consent Fix

## Issue Fixed
The app was requesting admin consent due to the `User.ReadWrite` scope in the profile editing configuration.

## Solution Applied
Removed all Graph API permissions and admin consent requirements by:

### 1. Updated `authConfig.ts`
- **Removed**: `User.ReadWrite` scope from `profileEditRequest`
- **Removed**: `prompt: 'consent'` and extra query parameters
- **Simplified**: Profile edit request to use only standard OpenID Connect scopes:
  ```typescript
  export const profileEditRequest = {
    scopes: ['openid', 'profile', 'email']
  };
  ```

### 2. Updated Helper Functions
- `getProfileEditAuthority()`: Now returns `null` (no special authority needed)
- `isProfileEditingAvailable()`: Always returns `true` (always available through Microsoft portal)
- `getSafeProfileEditRequest()`: Uses only standard scopes

### 3. Profile Editing Approach
- **New Component**: `SimpleProfileEditor` 
- **Method**: Directs users to Microsoft Account portal (https://myaccount.microsoft.com/profile)
- **User Flow**: Edit → Save → Sign out/in to refresh profile in app
- **Benefits**: No admin consent, no special permissions, works with all CIAM tenants

### 4. Updated AuthenticationStatus
- **Replaced**: `AzureProfileEditor` with `SimpleProfileEditor`
- **Removed**: All Graph API dependencies

## What This Means
- ✅ **No Admin Consent Required**: App uses only standard OpenID Connect scopes
- ✅ **Works for All Users**: Any user can edit their profile without admin approval
- ✅ **CIAM Compliant**: Follows Azure External Identity best practices
- ✅ **Simple & Secure**: Uses Microsoft's own profile management portal

## User Experience
1. User clicks "Edit Profile"
2. Gets redirected to Microsoft Account portal
3. Makes changes and saves
4. Returns to app and signs out/in to see updates
5. Profile information is refreshed automatically

## Technical Benefits
- No Graph API permissions needed
- No custom profile edit user flows
- No tenant-specific configuration required
- Works with default Azure External Identity setup
- Eliminates admin consent bottleneck

## Testing
- Build successful with no TypeScript errors
- All components properly integrated
- No remaining B2C or social login references
- Environment variables cleaned up
