# Social Login Implementation

This document provides an overview of the social login implementation in the Crisis Unleashed application.

## Supported Providers

The application supports the following social login providers:

- Google
- Discord

## Implementation Details

Social login is implemented using NextAuth.js, which handles the OAuth flow with the providers. The implementation consists of:

1. **NextAuth Configuration**: Configured in `src/app/api/auth/[...nextauth]/route.ts` with support for multiple providers.

2. **Frontend Components**: The login and registration forms include social login buttons in `src/components/auth/LoginForm.tsx` and `src/components/auth/RegisterForm.tsx`.

3. **Backend Integration**: When a user authenticates with a social provider, the application:
   - Verifies their identity with the provider
   - Creates or updates a user account in our database
   - Maintains the link between the social account and our user account

## Environment Variables

To enable social login, set the following environment variables:

``` txt
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# NextAuth/Auth.js core (choose the pair that matches your version)
# For NextAuth v4:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-strong-random-string
# For Auth.js v5:
# AUTH_URL=http://localhost:3000
# AUTH_SECRET=generate-a-strong-random-string

# Tip: set the *_URL to your production domain in prod (e.g., https://app.example.com)
```

## OAuth Provider Setup

### Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the consent screen if prompted
6. Select "Web application" as the application type
7. Add authorized JavaScript origins (e.g., `http://localhost:3000` for development)
8. Add authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`)
9. Copy the Client ID and Client Secret to your environment variables

### Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "OAuth2" section
4. Add a redirect URI (e.g., `http://localhost:3000/api/auth/callback/discord`)
5. Copy the Client ID and Client Secret to your environment variables

## User Flow

1. User clicks on a social login button
2. User is redirected to the provider's authentication page
3. After successful authentication, the provider redirects back to our application
4. NextAuth.js handles the callback and creates a session
5. The application syncs the user data with our database through the social-login API endpoint
6. User is logged in and redirected to the dashboard
