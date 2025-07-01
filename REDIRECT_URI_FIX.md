# Redirect URI Fix Guide

## 🚨 **The Problem**
You're getting this error: `"The provided value for the input parameter 'redirect_uri' is not valid"`

This means your Azure app registration doesn't have the correct redirect URIs configured.

## ✅ **The Solution**

### **Step 1: Find Your App Registration in Azure**

1. **Go to Azure Portal**: [portal.azure.com](https://portal.azure.com)
2. **Navigate to**: Azure Active Directory → App registrations
3. **Find your app** with Client ID: `dc245087-4913-4425-a15b-35b672d7b98f`
4. **Click on your app** to open the settings

### **Step 2: Add Redirect URIs**

1. **In your app registration**, click **"Authentication"** in the left menu
2. **Under "Redirect URIs"**, click **"+ Add a platform"**
3. **Select "Single-page application (SPA)"**
4. **Add these URIs** (add all of them):
   ```
   http://localhost:3000
   http://localhost:3000/
   https://localhost:3000
   https://localhost:3000/
   ```
5. **Click "Configure"** and then **"Save"**

### **Step 3: Verify the Configuration**

Your Authentication section should show:
- ✅ **Platform**: Single-page application
- ✅ **Redirect URIs**: 
  - `http://localhost:3000`
  - `http://localhost:3000/`
  - `https://localhost:3000`
  - `https://localhost:3000/`

### **Step 4: Test the Fix**

1. **Start your app**: `npm run dev`
2. **Go to**: http://localhost:3000
3. **Try Gmail sign-in** - it should now work!

## 🔧 **Alternative Quick Fix**

If you can't access Azure Portal, you can:

1. **Ask your Azure administrator** to add the redirect URIs
2. **Or use a different port** that might already be registered:
   ```bash
   # Try different ports
   npm run dev -- --port 3001
   npm run dev -- --port 8080
   ```

## 📋 **What We've Already Fixed in Your Code**

✅ **Dynamic Redirect URI Detection**: Your app now automatically detects the correct redirect URI
✅ **Better Error Handling**: Clear error messages when redirect URI issues occur  
✅ **Fallback to Redirect Flow**: If popup fails, it tries redirect authentication  
✅ **Gmail-Specific Configuration**: Optimized settings for Gmail sign-in  

## 🎯 **Expected Result**

After fixing the redirect URIs in Azure:
- ✅ Gmail sign-in will work
- ✅ Registration will work  
- ✅ All authentication flows will work
- ✅ No more redirect_uri errors

The issue is **100% on the Azure configuration side** - your code is correct!
