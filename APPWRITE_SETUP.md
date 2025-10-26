# recode's Appwrite Integration Setup Guide

This guide will walk you through setting up authentication with Appwrite for recode.

## Prerequisites

- An Appwrite account (sign up at https://cloud.appwrite.io)
- Node.js and npm installed

## Step 1: Create an Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name your project (e.g., "recode")
4. Copy the **Project ID** - you'll need this later

## Step 2: Configure Email/Password authentication

1. In your Appwrite Console, go to **Auth** → **Settings**
2. Go to **Auth methods**
3. Find **Email/Password** and enable it

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

| Attribute | Type   | Size  | Required | Array |
| --------- | ------ | ----- | -------- | ----- |
| title     | String | 255   | Yes      | No    |
| code      | String | 10000 | Yes      | No    |
| language  | String | 50    | Yes      | No    |
| tags      | String | 50    | Yes      | Yes   |

### 3.4: Set Permissions

1. Go to the **Settings** tab of your table
2. Under **Permissions**, add:
   - **Create**: Role: Users (authenticated users)

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

2. Open `http://localhost:3000` and use the Sign up / Sign in form with an email and password.
3. If verification is enabled, confirm the verification email and ensure the app accepts the verified user.
4. Test the password reset flow (Forgot password) to ensure recovery links open the app's reset page.

## Troubleshooting

### Common issues

- User unauthorized: check database/table permissions and row-level security settings.
- Environment variables missing: ensure `.env.local` is populated and restart the dev server.

## Production Deployment

When deploying to production:

1. Add your production domain in the Appwrite Console (Platforms) so redirect URLs work.
2. Set the production environment variables in your hosting platform (preferably Appwrite Sites).
3. Test sign-up, verification, and password recovery flows against the production domain.

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Auth Guide](https://appwrite.io/docs/products/auth)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check Appwrite logs in the Console
3. Verify all IDs and secrets are correct
