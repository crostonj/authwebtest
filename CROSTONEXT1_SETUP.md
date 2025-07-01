# Azure External Identity Setup for crostonext1 Tenant

## 🎯 **Your Configuration Status**

✅ **Tenant**: `crostonext1.ciamlogin.com`  
✅ **Client ID**: `dc245087-4913-4425-a15b-35b672d7b98f`  
✅ **Authority**: `https://crostonext1.ciamlogin.com/crostonext1.onmicrosoft.com`  
✅ **OAuth Flow**: Working (redirecting to correct tenant)  

## 🔧 **Required Azure Portal Configuration**

### **Step 1: Access Your App Registration**

1. **Go to**: [Azure Portal](https://portal.azure.com)
2. **Navigate to**: Azure Active Directory → App registrations
3. **Search for**: Client ID `dc245087-4913-4425-a15b-35b672d7b98f`
4. **Or search by name**: Look for your app in the `crostonext1` tenant

### **Step 2: Configure Redirect URIs**

In your app registration:

1. **Click "Authentication"** in the left menu
2. **Add platform** → **Single-page application (SPA)**
3. **Add these exact URIs**:
   ```
   http://localhost:3000
   http://localhost:3000/
   https://localhost:3000
   https://localhost:3000/
   ```
4. **Save** the configuration

### **Step 3: Verify Google Identity Provider**

For Gmail sign-in to work:

1. **Go to**: External Identities → All identity providers
2. **Check if Google is listed** and enabled
3. **If not present**: Follow the Gmail setup guide to add Google

### **Step 4: User Flow Configuration**

1. **Go to**: External Identities → User flows
2. **Select your sign-up/sign-in flow**
3. **Under Identity providers**: Ensure Google is checked
4. **Save** if changes were made

## 🔍 **Understanding Your OAuth Flow**

The URL you saw shows the **correct flow**:
```
redirect_uri=https%3a%2f%2fcrostonext1.ciamlogin.com%2fcommon%2ffederation%2foauth2msa
```

This means:
- ✅ Your app is correctly configured for `crostonext1` tenant
- ✅ Gmail federation is being attempted
- ✅ Microsoft is handling the OAuth flow properly
- ✅ The redirect will come back to Azure External Identity

## 🚀 **Testing Your Setup**

After configuring the redirect URIs:

1. **Start your app**: `npm run dev`
2. **Go to**: http://localhost:3000
3. **Try Gmail sign-in** - should now work without redirect URI errors
4. **Check browser console** for any remaining errors

## 📋 **Common Issues & Solutions**

### **Issue**: Still getting redirect URI errors
**Solution**: Double-check that `http://localhost:3000` (without trailing slash) is registered in Azure

### **Issue**: Gmail not showing as sign-in option
**Solution**: Google identity provider needs to be configured in Azure External Identity

### **Issue**: OAuth flow hangs or fails
**Solution**: 
- Clear browser cache
- Try incognito mode
- Wait 10-15 seconds for federation to complete

## 🎯 **Expected Working Flow**

1. **User clicks Gmail sign-in** → App initiates OAuth
2. **Redirect to Microsoft OAuth** → `login.live.com` handles Google federation
3. **Google authentication** → User signs in with Gmail
4. **Back to Azure** → `crostonext1.ciamlogin.com` processes the result
5. **Back to your app** → `http://localhost:3000` with authenticated user

Your tenant setup is **correct** - just need the redirect URIs registered! 🎉
