<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# React Azure External Identity Integration Project

This is a React TypeScript application that integrates with Azure External Identity for authentication and authorization.

## Key Technologies
- React 18 with TypeScript
- Vite for build tooling
- Azure MSAL (Microsoft Authentication Library) for authentication
- Azure External Identity (for customer identity scenarios)

## Authentication Flow
- Uses Azure External Identity for customer/external user authentication
- Implements OAuth 2.0 / OpenID Connect protocols via MSAL
- Supports sign-up, sign-in, and password reset flows
- Handles token management and refresh automatically

## Code Guidelines
- Use TypeScript for all components and utilities
- Follow React hooks patterns for state management
- Implement proper error handling for authentication flows
- Use MSAL React hooks for authentication state
- Keep Azure configuration in environment variables
- Implement proper loading states during authentication
