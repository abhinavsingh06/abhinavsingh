# EmailJS Setup Guide - Welcome Emails

Follow these steps to set up EmailJS for sending welcome emails to your newsletter subscribers.

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Click "Sign Up" (top right)
3. Sign up with Google, GitHub, or email
4. Verify your email if needed

## Step 2: Connect Your Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (Recommended - easiest)
   - **Outlook**
   - **Yahoo**
   - Or any SMTP service

### For Gmail (Recommended):

1. Select **"Gmail"**
2. Click **"Connect Account"**
3. Sign in with your Gmail account (abhinavsingh9986@gmail.com)
4. **IMPORTANT:** When Google asks for permissions, make sure to:
   - ✅ Allow **"Send email on your behalf"** permission
   - ✅ Grant **all requested scopes** (don't limit permissions)
   - ✅ If you see "Request had insufficient authentication scopes" error, you need to reconnect
5. **Copy your Service ID** (looks like: `service_xxxxxxx`)
   - You'll see it in the service list
   - It's usually something like `service_gmail` or `service_xxxxxxx`

### ⚠️ Fixing "Insufficient Authentication Scopes" Error:

If you get this error, follow these steps:

1. **Go to EmailJS Dashboard** → "Email Services"
2. **Delete the existing Gmail service** (if it exists)
3. **Create a new Gmail service:**
   - Click "Add New Service"
   - Select "Gmail"
   - Click "Connect Account"
   - **Sign in with your Gmail account again**
   - **IMPORTANT:** When Google shows the permission screen:
     - Make sure to check **ALL permissions**
     - Click "Allow" (not "Cancel" or "Limit")
     - Don't restrict any scopes
4. **Alternative: Use Gmail SMTP instead:**
   - If Gmail API keeps having issues, use "Gmail SMTP" option
   - This uses SMTP instead of Gmail API
   - More reliable, same result

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the dashboard
2. Click **"Create New Template"**
3. Name it: **"Newsletter Welcome Email"**

### Template Configuration:

**Template Name:** Newsletter Welcome Email

**Subject:** `{{subject}}`

**Content:** Use this template structure:

```
To: {{to_email}}
From: {{from_name}} <{{from_email}}>
Reply-To: {{reply_to}}
Subject: {{subject}}

{{message_html}}
```

**Important:** Make sure to use the exact variable names:

- `{{to_email}}` - Subscriber's email
- `{{from_name}}` - Your name
- `{{from_email}}` - Your email
- `{{subject}}` - Email subject
- `{{message_html}}` - HTML content
- `{{reply_to}}` - Reply-to address

4. Click **"Save"**
5. **Copy your Template ID** (looks like: `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** (or click your profile)
2. Find **"Public Key"** or **"User ID"**
3. **Copy your Public Key** (looks like: `xxxxxxxxxxxxx`)

## Step 5: Add Environment Variables

### For Local Development:

1. Create or edit `.env.local` in your project root:

   ```bash
   EMAILJS_SERVICE_ID=service_xxxxxxx
   EMAILJS_TEMPLATE_ID=template_xxxxxxx
   EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
   ```

2. Replace the values with your actual IDs from steps 2, 3, and 4

### For Production (Vercel/Netlify/etc.):

1. **Vercel:**

   - Go to your project → Settings → Environment Variables
   - Add all three variables:
     - `EMAILJS_SERVICE_ID`
     - `EMAILJS_TEMPLATE_ID`
     - `EMAILJS_PUBLIC_KEY`

2. **Netlify:**

   - Go to Site Settings → Build & Deploy → Environment
   - Add all three variables

3. **Other platforms:** Add the environment variables according to their documentation

## Step 6: Test It!

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Go to your blog and subscribe with a test email

3. Check your inbox for the welcome email!

4. Check EmailJS dashboard → "Email Logs" to see if emails were sent

## Troubleshooting

### Email not sending?

1. **Check Environment Variables:**

   - Make sure all three are set correctly
   - Restart your dev server after adding them
   - Check for typos in the IDs

2. **Check EmailJS Dashboard:**

   - Go to "Email Logs" to see error messages
   - Check if your email service is connected properly

3. **Check Server Logs:**

   - Look for "EmailJS error" messages in your console
   - Check the error details

4. **Verify Template Variables:**
   - Make sure template uses exact variable names: `{{to_email}}`, `{{message_html}}`, etc.
   - Template should accept HTML content

### Common Issues:

**"Invalid service_id"**

- Double-check your Service ID
- Make sure the service is connected and active

**"Invalid template_id"**

- Double-check your Template ID
- Make sure template is saved and published

**"Invalid user_id"**

- Double-check your Public Key
- Make sure it's the Public Key, not API Key

**"Email goes to spam"**

- This is normal for first few emails
- Make sure your "from" email is verified
- Consider using a custom domain email later

## EmailJS Limits

- **Free Tier:** 100 emails/month
- **Paid Plans:** Start at $15/month for 1,000 emails

## Next Steps

Once set up:

1. ✅ Test with a few emails
2. ✅ Monitor EmailJS dashboard for delivery
3. ✅ Check spam folders initially
4. ✅ Consider upgrading if you exceed 100/month

## Quick Reference

Your `.env.local` should look like:

```bash
EMAILJS_SERVICE_ID=service_abc123
EMAILJS_TEMPLATE_ID=template_xyz789
EMAILJS_PUBLIC_KEY=user_abcdefghijklmnop
```

That's it! Your welcome emails should now work! 🎉
