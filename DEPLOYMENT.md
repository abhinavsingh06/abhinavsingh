# Deployment Guide - Newsletter Configuration

## Issue: "Newsletter is not configured properly"

This error occurs when the required environment variables are missing in your production environment.

## Required Environment Variables

You need to add these two environment variables to your production hosting platform:

1. **RESEND_API_KEY** - Your Resend API key (starts with `re_`)
2. **RESEND_AUDIENCE_ID** - Your Resend Audience ID (UUID format)

## How to Get These Values

### 1. Get Your Resend API Key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Sign in or create an account
3. Click "Create API Key"
4. Give it a name (e.g., "Blog Newsletter")
5. Copy the API key (starts with `re_`)

### 2. Get Your Resend Audience ID

1. Go to [Resend Audiences](https://resend.com/audiences)
2. Click "Create Audience" or use an existing one
3. Enter a name (e.g., "Newsletter Subscribers")
4. Click on the audience you created
5. Copy the **Audience ID** (UUID format like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Setting Up Environment Variables by Platform

### Vercel

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:
   - **Name:** `RESEND_API_KEY`
     **Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Name:** `RESEND_AUDIENCE_ID`
     **Value:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
5. Make sure to select **Production**, **Preview**, and **Development** environments
6. Click **Save**
7. **Redeploy** your application for changes to take effect

### Netlify

1. Go to your site on [Netlify Dashboard](https://app.netlify.com)
2. Go to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add:
   - `RESEND_API_KEY` = `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - `RESEND_AUDIENCE_ID` = `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
5. Click **Save**
6. **Trigger a new deploy** for changes to take effect

### Other Platforms

For other hosting platforms (Railway, Render, etc.):

1. Find the **Environment Variables** or **Config** section in your dashboard
2. Add both `RESEND_API_KEY` and `RESEND_AUDIENCE_ID`
3. Redeploy your application

## Verify Configuration

After adding the environment variables and redeploying:

1. Visit your live site
2. Try subscribing to the newsletter
3. You should see a success message instead of the error

## Local Development

For local development, create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Troubleshooting

### Still seeing the error after adding variables?

1. **Redeploy** - Environment variables require a new deployment
2. **Check spelling** - Variable names are case-sensitive
3. **Check values** - Make sure there are no extra spaces or quotes
4. **Check environment** - Ensure variables are set for the correct environment (Production/Preview)

### Need to create a new audience?

Run this script locally (with your API key in `.env.local`):

```bash
npx tsx scripts/create-audience.ts "Newsletter Subscribers"
```

This will output the Audience ID you need.
