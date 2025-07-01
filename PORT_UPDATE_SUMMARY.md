# Port Configuration Update - Summary

## ✅ Changes Made to Use Port 3000

### 1. **Vite Configuration** (`vite.config.ts`)
- Added server configuration to use port 3000
- Added `host: true` for external access

### 2. **Environment Variables** (`.env`)
- Updated `VITE_REDIRECT_URI=http://localhost:3000`
- Updated `VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:3000`

### 3. **Environment Template** (`.env.example`)
- Updated example redirect URIs to use port 3000

### 4. **Documentation** (`README.md`)
- Updated setup instructions to reference port 3000
- Updated Azure configuration steps to use port 3000
- Updated running instructions to show port 3000

### 5. **Authentication Configuration** (`authConfig.ts`)
- Default fallback URIs already configured for port 3000

## 🚀 How to Use

### Start Development Server
```bash
npm run dev
```

### Access Application
- **URL**: `http://localhost:3000`
- **Azure Redirect URIs**: Make sure to register `http://localhost:3000` in your Azure External Identity application

## ⚠️ Important Azure Configuration

**You must update your Azure External Identity application registration:**

1. Go to Azure Portal
2. Navigate to your External Identity application
3. Update the redirect URIs to include:
   - `http://localhost:3000`
4. Remove the old `http://localhost:5173` URI if no longer needed

## ✅ Verification

- Build completed successfully ✓
- All configuration files updated ✓
- Documentation updated ✓
- Ready to run on port 3000 ✓
