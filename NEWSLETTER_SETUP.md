# Newsletter Setup Guide

This blog uses **Web3Forms** for newsletter subscriptions.

## Current Configuration

✅ **Web3Forms is already configured!**

- Access Key: `50d76527-8aaa-4be3-9610-af0ea18a4abe`
- Success URL: `https://abhinavsingh.online/subscribe`
- Free tier: 250 submissions/month

## Setup (Already Done!)

The newsletter subscription is already set up and ready to use. The access key is configured in the code.

### Optional: Environment Variables

If you want to manage the access key via environment variables (recommended for production):

1. **Create `.env.local` file** in the root directory:

   ```bash
   WEB3FORMS_ACCESS_KEY=50d76527-8aaa-4be3-9610-af0ea18a4abe
   WEB3FORMS_SUCCESS_URL=https://abhinavsingh.online/subscribe
   ```

2. **For Production** (Vercel, Netlify, etc.):
   - Add `WEB3FORMS_ACCESS_KEY` to your hosting platform's environment variables
   - Add `WEB3FORMS_SUCCESS_URL` (optional)

## How It Works

1. User enters their email in the newsletter form
2. Form submits to `/api/newsletter` endpoint
3. API sends the subscription to Web3Forms
4. Web3Forms sends you an email notification
5. User sees a success message

## Testing

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to your blog and try subscribing with a test email

3. Check your email inbox for the Web3Forms notification

4. You can also view submissions in your Web3Forms dashboard at https://web3forms.com

## Managing Subscribers

- **View Submissions**: Log in to https://web3forms.com to see all newsletter subscriptions
- **Export Data**: You can export subscriber emails from the Web3Forms dashboard
- **Email Notifications**: Web3Forms automatically sends you an email for each subscription

## Environment Variables

### Optional (for production)

- `WEB3FORMS_ACCESS_KEY` - Your Web3Forms access key (defaults to configured value)
- `WEB3FORMS_SUCCESS_URL` - Redirect URL after successful subscription (defaults to configured value)

## Production Deployment

When deploying to production:

1. **Vercel**:

   - Go to Project Settings → Environment Variables
   - Add `WEB3FORMS_ACCESS_KEY` = `50d76527-8aaa-4be3-9610-af0ea18a4abe`
   - Add `WEB3FORMS_SUCCESS_URL` = `https://abhinavsingh.online/subscribe` (optional)

2. **Netlify**:

   - Go to Site Settings → Build & Deploy → Environment
   - Add the same variables

3. **Other platforms**: Add the environment variables according to their documentation

## Troubleshooting

### "Failed to process subscription"

- Check that your Web3Forms access key is valid
- Verify you haven't exceeded the 250 submissions/month limit
- Check server logs for detailed error messages

### Submissions not appearing

- Check your email inbox for Web3Forms notifications
- Log in to https://web3forms.com to view submissions
- Check browser console and server logs for errors

### Rate limiting

- Free tier allows 250 submissions/month
- If you exceed the limit, consider upgrading to a paid plan
- The limit resets monthly

## Web3Forms Features

- ✅ Free tier: 250 submissions/month
- ✅ Email notifications for each subscription
- ✅ Spam protection built-in
- ✅ No backend required (handled by Web3Forms)
- ✅ GDPR compliant
- ✅ Easy subscriber management dashboard
