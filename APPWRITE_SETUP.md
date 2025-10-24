# Appwrite GitHub OAuth Integration Setup Guide

This guide will walk you through setting up GitHub OAuth authentication with Appwrite for recode.

## Prerequisites

- An Appwrite account (sign up at https://cloud.appwrite.io)
- A GitHub account
- Node.js and npm installed

## Step 1: Create an Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name your project (e.g., "recode")
4. Copy the **Project ID** - you'll need this later

## Step 2: Configure GitHub OAuth

### 2.1: Create a GitHub OAuth App

1. Go to your [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the details:
   - **Application name**: recode (or your preferred name)
   - **Homepage URL**:
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorization callback URL**:
     - Get this from Appwrite (next step)
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy the **Client Secret**

### 2.2: Configure OAuth in Appwrite

1. In your Appwrite Console, go to **Auth** → **Settings**
2. Scroll down to **OAuth2 Providers**
3. Find **GitHub** and click on it
4. Toggle "Enable" to ON
5. Enter your GitHub **Client ID** and **Client Secret**
6. Copy the **Redirect URI** provided by Appwrite
7. Go back to your GitHub OAuth App and update the **Authorization callback URL** with the Appwrite redirect URI
8. In Appwrite, add your success and failure redirect URLs:
   - Success: `http://localhost:3000/dashboard` (or your production dashboard URL)
   - Failure: `http://localhost:3000/` (or your production home URL)

## Step 3: Create Database and Table

### 3.1: Create a Database

1. In Appwrite Console, go to **Databases**
2. Click "Create Database"
3. Name it "codevault" (or your preferred name)
4. Copy the **Database ID**

### 3.2: Create a Table for Snippets

1. Click on your newly created database
2. Click "Create table"
3. Name it "snippets"
4. Copy the **Table ID**

### 3.3: Add Attributes to the Table

Add the following attributes:

| Attribute | Type     | Size  | Required | Array |
| --------- | -------- | ----- | -------- | ----- |
| title     | String   | 255   | Yes      | No    |
| code      | String   | 10000 | Yes      | No    |
| language  | String   | 50    | Yes      | No    |
| tags      | String   | 50    | Yes      | Yes   |
| userId    | String   | 255   | Yes      | No    |
| createdAt | DateTime | -     | Yes      | No    |

### 3.4: Set Permissions

1. Go to the **Settings** tab of your table
2. Under **Permissions**, add:
   - **Create**: Role: Any (authenticated users)

### 3.5: Enable Row Security

1. Go to the **Row security** tab
2. Enable **Row security**

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values in `.env.local`:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
   NEXT_PUBLIC_APPWRITE_SNIPPETS_TABLE_ID=your_snippets_table_id_here
   ```

## Step 5: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open http://localhost:3000
3. Click "Sign in with GitHub"
4. You should be redirected to GitHub to authorize the app
5. After authorization, you should be redirected back to your dashboard

## Troubleshooting

### "Invalid OAuth credentials"

- Double-check your GitHub Client ID and Secret in Appwrite
- Make sure the redirect URI in GitHub matches exactly with Appwrite's redirect URI

### "Redirect URI mismatch"

- Verify the callback URL in your GitHub OAuth App
- Make sure you've added both development and production URLs

### "User unauthorized"

- Check table permissions in Appwrite
- Make sure authenticated users have proper CRUD permissions

### "Environment variables not found"

- Make sure `.env.local` exists and has all required variables
- Restart your development server after adding environment variables

## Production Deployment

When deploying to production:

1. Add your production domain to GitHub OAuth App URLs
2. Update Appwrite OAuth success/failure URLs with production URLs
3. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Test the complete OAuth flow in production

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Auth Guide](https://appwrite.io/docs/products/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Appwrite logs in the Console
3. Verify all IDs and secrets are correct
4. Make sure your GitHub OAuth app is active
