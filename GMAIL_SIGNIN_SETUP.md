# Gmail Sign-in Setup for Azure External Identity

This guide will help you configure Gmail sign-in for your Azure External Identity (CIAM) application.

## Prerequisites

1. An Azure External Identity tenant (CIAM)
2. Your app registration already created in Azure
3. Admin access to the Azure portal

## Azure Configuration Steps

### Step 1: Enable Google Identity Provider in Azure External Identity

1. **Navigate to External Identities**:
   - Go to the Azure portal (portal.azure.com)
   - Navigate to "Azure Active Directory" → "External Identities"
   - Select "All identity providers"

2. **Add Google Identity Provider**:
   - Click "+ Google"
   - You'll need to create a Google OAuth app first

### Step 2: Create Google OAuth Application

1. **Go to Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com/oauth2/authresp
     https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com/B2C_1A_GOOGLE_signin/oauth2/authresp
     ```
   - Note: Replace `crostonext1` with your actual tenant name

4. **Save Client ID and Secret**:
   - Copy the Client ID and Client Secret - you'll need these in Azure

### Step 3: Configure Google Provider in Azure

1. **Return to Azure External Identities**:
   - In "All identity providers", click "+ Google"
   - Enter the Google Client ID and Client Secret from step 2
   - Click "Save"

2. **Configure User Flow**:
   - Go to "User flows" in your External Identity settings
   - Select your sign-up/sign-in user flow (or create one)
   - Under "Identity providers", ensure Google is checked
   - Save the configuration

### Step 4: Update App Registration

1. **Navigate to App Registrations**:
   - Go to "Azure Active Directory" → "App registrations"
   - Select your app

2. **Update Redirect URIs** (if needed):
   - Ensure your redirect URIs include:
     ```
     http://localhost:3000
     http://localhost:3000/
     ```

3. **API Permissions**:
   - Ensure you have the following permissions:
     - `openid`
     - `profile`
     - `email`

## Testing Gmail Sign-in

1. **Start your React app**:
   ```bash
   npm run dev
   ```

2. **Test the flow**:
   - Click "Sign In" or "Sign Up"
   - You should see Google as an option on the sign-in page
   - Select Google and authenticate with your Gmail account
   - You should be redirected back to your app

## Troubleshooting

### Common Issues:

1. **Google not showing as option**:
   - Verify Google is enabled in your user flow
   - Check that the user flow is correctly associated with your app

2. **Redirect URI mismatch**:
   - Ensure redirect URIs match exactly in both Google and Azure
   - Check for trailing slashes

3. **Permission errors**:
   - Verify API permissions in your app registration
   - Ensure Google+ API is enabled in Google Cloud Console

4. **User flow errors**:
   - Check that your user flow includes Google as an identity provider
   - Verify the user flow is published and active

### Environment Variables

Make sure your `.env` file has the correct values:
```env
VITE_AZURE_CLIENT_ID=dc245087-4913-4425-a15b-35b672d7b98f
VITE_AZURE_AUTHORITY=https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com
VITE_REDIRECT_URI=http://localhost:3000
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

## Additional Notes

- Gmail users will be able to sign in using their existing Google accounts
- The first time a Gmail user signs in, they'll be creating a new account in your Azure External Identity tenant
- User profile information (name, email) will be automatically populated from their Google account
- Users can use either the standard sign-in flow or the registration flow - both will work with Google accounts

## UI Considerations

The current app provides:
1. Standard "Sign In" and "Sign Up" buttons that will show Google as an option
2. A dedicated "Sign in with Google" button for direct Google authentication
3. Clear messaging about using personal accounts including Gmail

Once Azure is configured, users will see Google as an authentication option automatically.
