# React Azure External Identity Integration

A React TypeScript application that demonstrates integration with Azure External Identity for customer authentication and authorization.

## 🚀 Features

- **Azure External Identity Integration**: Complete authentication flow using Azure MSAL
- **Social Sign-in**: Gmail/Google and Microsoft account authentication
- **User Registration**: Multiple registration options (quick sign-up, form-based registration)
- **Password Management**: Secure password reset functionality
- **TypeScript Support**: Fully typed components and configuration
- **Modern React**: Built with React 18 and Vite for optimal performance
- **Responsive UI**: Clean, modern interface with authentication status
- **Secure Token Management**: Automatic token refresh and secure storage
- **User Profile Display**: Shows authenticated user information and claims
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## 🛠️ Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Azure MSAL React** (@azure/msal-react, @azure/msal-browser)
- **Azure External Identity** for customer authentication
- **Google OAuth** for Gmail sign-in integration
- **Microsoft Account** for Microsoft personal account sign-in

## 🔐 Authentication & Registration Features

### Authentication Flow
1. **Unauthenticated State**: Shows multiple registration and sign-in options
2. **Quick Sign-Up**: Direct Azure External Identity registration with popup
3. **Social Sign-in**: Gmail/Google and Microsoft account authentication
4. **Form Registration**: Pre-fill user details before Azure registration
5. **Sign-In**: Existing user authentication with Azure External Identity
6. **Password Reset**: Secure password recovery flow
7. **Authenticated State**: Displays user profile information and sign-out option
8. **Token Management**: MSAL handles token refresh automatically

### Registration Options
- **Quick Registration**: Direct sign-up with Azure External Identity
- **Gmail Sign-in**: Use existing Google/Gmail accounts
- **Microsoft Sign-in**: Use existing Microsoft personal accounts
- **Form-Based Registration**: Collect user details before Azure registration
- **Password Reset**: Self-service password recovery
- **Email Verification**: Automatic email verification during registration

### Social Identity Providers
- **Google/Gmail**: Users can sign in with their Google accounts
- **Microsoft**: Users can sign in with their Microsoft personal accounts
- **Azure External Identity**: Native Azure customer identity accounts

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 16 or higher)
2. **Azure External Identity tenant** configured
3. **Application registered** in Azure with proper redirect URIs

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Configure Azure External Identity

1. **Register your application** in the Azure portal under your External Identity tenant
2. **Set redirect URIs** in Azure:
   - `http://localhost:3000` (for development)
   - Add your production URL when deploying
3. **Copy the Client ID** from your Azure application registration

### 3. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Azure configuration:
   ```env
   VITE_AZURE_CLIENT_ID=your-client-id-here
   VITE_AZURE_AUTHORITY=https://your-tenant.ciamlogin.com/your-tenant.onmicrosoft.com
   VITE_REDIRECT_URI=http://localhost:3000
   VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
   
   # Optional: User flow settings for specific registration/reset flows
   VITE_AZURE_SIGNUP_FLOW=B2C_1_signup
   VITE_AZURE_SIGNIN_FLOW=B2C_1_signin
   VITE_AZURE_RESET_PASSWORD_FLOW=B2C_1_reset_password
   ```

## 📧 Gmail Sign-in Setup

To enable Gmail sign-in for your users:

1. **Configure Google Identity Provider in Azure**: Follow the detailed setup guide in [`GMAIL_SIGNIN_SETUP.md`](./GMAIL_SIGNIN_SETUP.md)
2. **Enable in Azure External Identity**: Add Google as an identity provider in your tenant
3. **Configure User Flows**: Ensure your sign-up/sign-in user flows include Google
4. **Test the Integration**: Use the "Sign in with Google" button to verify setup

The app includes:
- Dedicated "Sign in with Google" button for direct Gmail authentication
- "Sign in with Microsoft" button for Microsoft personal accounts
- Standard Azure External Identity sign-in/sign-up flows

> **Note**: Gmail sign-in requires proper configuration in both Google Cloud Console and Azure External Identity. See the setup guide for detailed instructions.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 🔐 Authentication Flow

1. **Unauthenticated State**: Shows sign-in button and setup instructions
2. **Sign-In**: Uses Azure External Identity popup for authentication
3. **Authenticated State**: Displays user profile information and sign-out option
4. **Token Management**: MSAL handles token refresh automatically

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthenticationStatus.tsx       # Main authentication UI
│   ├── AuthenticationOptions.tsx      # Registration and sign-in options
│   ├── SignInButton.tsx              # Azure sign-in component
│   ├── SignUpButton.tsx              # Quick registration component
│   ├── SignOutButton.tsx             # Sign-out component
│   ├── RegistrationForm.tsx          # Form-based registration
│   ├── ForgotPasswordButton.tsx      # Password reset component
│   ├── ProfileData.tsx               # User profile display
│   └── AuthErrorBoundary.tsx         # Error handling component
├── authConfig.ts                     # Azure MSAL configuration
├── App.tsx                           # Main application component
└── main.tsx                          # App entry point with MSAL provider
```

## 🔧 Configuration Details

### Azure External Identity Setup

The application uses Azure External Identity (CIAM) which is designed for customer scenarios. Key configuration points:

- **Authority URL**: Format is `https://your-tenant.ciamlogin.com/your-tenant.onmicrosoft.com`
- **Scopes**: Uses OpenID Connect scopes (`openid`, `profile`, `email`)
- **Cache**: Uses session storage for security
- **Redirect Flow**: Supports both popup and redirect authentication flows

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AZURE_CLIENT_ID` | Your Azure application client ID | `12345678-1234-1234-1234-123456789012` |
| `VITE_AZURE_AUTHORITY` | Your Azure External Identity authority | `https://contoso.ciamlogin.com/contoso.onmicrosoft.com` |
| `VITE_REDIRECT_URI` | Redirect URI after login | `http://localhost:5173` |
| `VITE_POST_LOGOUT_REDIRECT_URI` | Redirect URI after logout | `http://localhost:5173` |

## 📚 Additional Resources

- [Azure External Identity Documentation](https://docs.microsoft.com/en-us/azure/active-directory/external-identities/)
- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
