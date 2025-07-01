# Azure External Identity Configuration Guide

## 🎯 The Issue You're Experiencing

The error `AADSTS90072` is **normal and expected** for Azure External Identity when using organization accounts from different tenants. This is by design for customer identity scenarios.

## ✅ Azure External Identity Setup (Required Steps)

### 1. **Configure External Identity Tenant Settings**

In your Azure Portal for the `InfraPracticeExtID` tenant:

```
Azure Portal → External Identities → External collaboration settings
```

**Enable:**
- ✅ Guest user access restrictions: Allow any user
- ✅ Guest invite settings: Anyone in the organization can invite
- ✅ Self-service sign up: Enable for consumer scenarios

### 2. **Application Registration Settings**

For your app `CLA-Demo` (ef8a285e-019d-472b-866e-ca5c50eb1d88):

```
Azure Portal → App registrations → CLA-Demo → Authentication
```

**Configure:**
- ✅ Redirect URIs: `http://localhost:3000`
- ✅ Account types: **"Accounts in any identity provider or organizational directory (for authenticating external users)"**
- ✅ Allow public client flows: No (recommended)

### 3. **User Flow Configuration (If Using User Flows)**

```
Azure Portal → External Identities → User flows
```

**Create flows for:**
- Sign up and sign in
- Password reset
- Profile editing (optional)

### 4. **Identity Providers**

```
Azure Portal → External Identities → Identity providers
```

**Enable:**
- ✅ Email one-time passcode (for any email)
- ✅ Local account (email + password)
- ✅ Social accounts (Google, Facebook, etc.) - optional

## 🚀 **How to Test/Use Azure External Identity**

### For Development/Testing:

1. **Use Personal Email Registration:**
   ```
   - Go to your app sign-up page
   - Click "Create Account"
   - Use Gmail, Outlook.com, Yahoo, etc.
   - Complete registration
   ```

2. **Invite Organization Users:**
   ```
   Azure Portal → External Identities → All users → Invite user
   - Enter: jcroston@3cloudsolutions.com
   - Send invitation
   - Accept invitation email
   - Then try signing in
   ```

### For Production:

1. **Customer Self-Registration:**
   - Customers use personal emails
   - Self-service registration
   - No admin approval needed

2. **Partner Organization Access:**
   - Invite specific organization users
   - They accept invitations
   - Then can access your app

## 🔧 **Your Current Configuration Status**

✅ **Correct Authority:** `https://InfraPracticeExtID.ciamlogin.com/InfraPracticeExtID.onmicrosoft.com`
✅ **Correct Client ID:** `ef8a285e-019d-472b-866e-ca5c50eb1d88`
✅ **Correct Redirect URI:** `http://localhost:3000`
✅ **Correct Application Type:** External Identity (CIAM)

## ⚡ **Quick Solutions**

### Immediate Testing:
1. Use a Gmail/Outlook.com account to test registration
2. Or ask tenant admin to invite your organization account

### Long-term Setup:
1. Configure proper user flows in Azure Portal
2. Enable self-service registration for customers
3. Set up invitation flows for partners

## 📞 **Need Administrator Action**

The tenant administrator for `InfraPracticeExtID` needs to:

1. **Invite your account:**
   ```
   Azure Portal → External Identities → Users → Invite user
   Email: jcroston@3cloudsolutions.com
   ```

2. **Or enable broader access:**
   ```
   Azure Portal → External Identities → External collaboration settings
   → Allow any domain or specific domains
   ```

Your application code and configuration are **100% correct** for Azure External Identity. The "error" you're seeing is the expected security behavior!
