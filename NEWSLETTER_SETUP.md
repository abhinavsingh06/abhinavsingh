# Complete Newsletter System Setup Guide

This is your complete guide to setting up the automatic newsletter system with welcome emails and blog post notifications.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Brevo Email Service Setup](#brevo-email-service-setup)
3. [Newsletter Secret Setup](#newsletter-secret-setup)
4. [Automation Setup](#automation-setup)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Quick Start

**5-minute setup:**

1. ✅ Set up Brevo account and get API key
2. ✅ Generate newsletter secret
3. ✅ Add environment variables
4. ✅ Set up automation (GitHub Actions recommended)
5. ✅ Test it!

---

## Brevo Email Service Setup

### Why Brevo?

- ✅ **9,000 emails/month FREE** (300 emails/day)
- ✅ **Server-side friendly** - Works perfectly from Next.js API routes
- ✅ **No template setup needed** - Send HTML directly
- ✅ **Better deliverability** - Professional email service

### Step 1: Create Brevo Account

1. Go to https://www.brevo.com/
2. Click **Sign up free**
3. Create your account (email verification required)
4. Complete the onboarding process

### Step 2: Get Your API Key

1. **Log in to Brevo Dashboard:**

   - Go to https://app.brevo.com/

2. **Navigate to API Keys:**

   - Click on your profile (top right)
   - Go to **SMTP & API** → **API Keys**
   - Or go directly to: https://app.brevo.com/settings/keys/api

3. **Create API Key:**
   - Click **Generate a new API key**
   - Give it a name (e.g., "Blog Newsletter")
   - **Copy the API key** (you'll only see it once!)
   - It looks like: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxx`

### Step 3: Verify Your Sender Email

1. **Go to Senders:**

   - Navigate to **Senders** → **Add a sender**
   - Or go to: https://app.brevo.com/senders/list

2. **Add Your Email:**

   - Enter your email: `abhinavsingh9986@gmail.com`
   - Enter your name: `Abhinav Singh`
   - Click **Save**

3. **Verify Email:**
   - Brevo will send a verification email
   - Click the verification link in the email
   - Your sender is now verified ✅

### ⚠️ Free Email Domain Warning

**You may see:** "Freemail domain is not recommended" or "Not Compliant"

**What to do:**

- ✅ **For testing/small volumes:** Close the warning and proceed with Gmail
- ✅ **For production:** Set up a custom domain (see [Custom Domain Setup](#custom-domain-setup))

**Gmail works fine for:**

- Personal blogs
- Testing
- Small subscriber lists (< 100)
- Getting started

**Upgrade to custom domain if:**

- Large subscriber list (> 100)
- Professional/business use
- High deliverability requirements
- Seeing emails go to spam

### Custom Domain Setup (Optional)

If you own a domain (e.g., `abhinavsingh.online`):

1. Go to **Domains** tab in Brevo
2. Click **Add a domain**
3. Enter your domain
4. Add DNS records (SPF, DKIM, DMARC) to your domain
5. Wait for verification
6. Create a new sender with your domain email (e.g., `newsletter@abhinavsingh.online`)

---

## Newsletter Secret Setup

The newsletter secret is a security key to protect your newsletter API from unauthorized access.

### Generate Secret

**Mac/Linux:**

```bash
openssl rand -hex 32
```

**Windows (PowerShell):**

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Or use Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Or create your own:**
Any long random string (at least 32 characters), e.g.:

```
my-super-secret-newsletter-key-2024-abhinav-blog-xyz123
```

### Add to Environment Variables

Add to `.env.local`:

```env
NEWSLETTER_SECRET=your-generated-secret-here
```

---

## Environment Variables

### Local Development (.env.local)

Create or update `.env.local` in your project root:

```env
# Brevo API Key (from Step 2 above)
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxx

# Newsletter Secret (generated above)
NEWSLETTER_SECRET=your-generated-secret-here
```

### Production (Vercel/Netlify)

**Vercel:**

1. Go to your project → **Settings** → **Environment Variables**
2. Add both `BREVO_API_KEY` and `NEWSLETTER_SECRET`
3. Select all environments (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

**Netlify:**

1. Go to **Site settings** → **Environment variables**
2. Add both `BREVO_API_KEY` and `NEWSLETTER_SECRET`
3. Click **Save**
4. **Trigger a new deploy**

---

## Automation Setup

Choose ONE automation method:

### Option A: GitHub Actions (Recommended) ⭐

**Best for:** Free, secure, works with any hosting

**Steps:**

1. **Go to GitHub repo:**

   - Navigate to **Settings** → **Secrets and variables** → **Actions**

2. **Add Secrets:**

   - `NEWSLETTER_SECRET` = your secret from above
   - `NEWSLETTER_WEBHOOK_URL` = `https://abhinavsingh.online/api/auto-newsletter`
     (Replace with your actual domain)

3. **Push to GitHub:**
   - The workflow (`.github/workflows/newsletter.yml`) will activate automatically
   - Runs daily at 10 AM UTC
   - Also triggers when you push new blog posts

**File:** `.github/workflows/newsletter.yml` ✅ Already created

### Option B: Vercel Cron (Requires Vercel Pro)

**Best for:** Vercel Pro users ($20/month)

**Steps:**

1. Open `vercel.json`
2. Replace `YOUR_SECRET_KEY_HERE` with your actual secret
3. Deploy to Vercel

**Note:** Secret will be visible in the file. For better security, use GitHub Actions.

**File:** `vercel.json` ✅ Already created

### Option C: Manual Trigger

**Best for:** Testing or occasional use

**Usage:**

```bash
curl -X POST "https://abhinavsingh.online/api/auto-newsletter?secret=your-secret-key"
```

---

## Testing

### Test Welcome Email

```bash
# Make sure dev server is running
npm run dev

# In another terminal
npx tsx scripts/test-welcome-email.ts your-email@example.com
```

### Test Newsletter Status

```bash
# Check what posts need newsletters
npx tsx scripts/test-auto-newsletter.ts check

# Send newsletters for new posts
npx tsx scripts/test-auto-newsletter.ts send
```

### Test Subscription Flow

1. Go to your blog
2. Subscribe with a test email
3. Check inbox for welcome email
4. Verify subscriber was added

---

## Troubleshooting

### Welcome Email Not Sending

**Check:**

1. ✅ `BREVO_API_KEY` is set in `.env.local`
2. ✅ Sender email is verified in Brevo dashboard
3. ✅ Check server logs for errors
4. ✅ Test with: `npx tsx scripts/test-welcome-email.ts your-email@example.com`

**Common Issues:**

- **"Invalid API key"** → Check API key is correct, no extra spaces
- **"Sender not verified"** → Verify sender email in Brevo dashboard
- **Rate limiting** → Free tier: 300 emails/day, wait or upgrade

### Newsletter Not Sending

**Check:**

1. ✅ `NEWSLETTER_SECRET` matches in request and environment
2. ✅ Automation is set up (GitHub Actions/Vercel Cron)
3. ✅ Check server logs for errors
4. ✅ Test manually: `curl -X POST "http://localhost:3000/api/auto-newsletter?secret=your-secret"`

**Common Issues:**

- **"Unauthorized"** → Secret doesn't match
- **"No new posts"** → All posts already have newsletters sent
- **"No subscribers"** → Add subscribers first

### Emails Going to Spam

**If using Gmail sender:**

- This is normal for free email domains
- Ask subscribers to check spam folder
- Mark as "Not Spam" to improve deliverability
- Consider upgrading to custom domain

**If using custom domain:**

- Verify DNS records (SPF, DKIM, DMARC) are correct
- Check Brevo dashboard for authentication status
- Wait 24-48 hours for DNS propagation

### Brevo Quota Exceeded

- Free tier: 300 emails/day (9,000/month)
- Check Brevo dashboard for usage
- Wait 24 hours or upgrade plan
- Consider batching sends

---

## Production Deployment

### Checklist

Before going live:

- [ ] Brevo account set up
- [ ] API key added to production environment
- [ ] Sender email verified
- [ ] Newsletter secret added to production
- [ ] Automation configured (GitHub Actions/Vercel Cron)
- [ ] Tested welcome emails
- [ ] Tested newsletter sending
- [ ] Monitored first few sends

### Environment Variables in Production

Make sure these are set:

- `BREVO_API_KEY`
- `NEWSLETTER_SECRET`

### Monitoring

**Check:**

- Brevo dashboard → **Statistics** → **Email activity**
- Server logs for errors
- Subscriber feedback

---

## How It Works

### Welcome Emails

1. User subscribes via newsletter form
2. Subscriber added to `data/subscribers.json`
3. Welcome email sent automatically via Brevo
4. Beautiful ocean-themed email delivered

### Automatic Newsletters

1. Automation triggers (daily or on new posts)
2. System checks for new blog posts
3. Finds posts that haven't had newsletters sent
4. Sends beautiful emails to all subscribers via Brevo
5. Tracks sent newsletters in `data/sent-newsletters.json`
6. Prevents duplicate sending

### Manual Newsletter Sending

```bash
# Check status
curl "http://localhost:3000/api/auto-newsletter?secret=your-secret"

# Send newsletters
curl -X POST "http://localhost:3000/api/auto-newsletter?secret=your-secret"
```

---

## Brevo Free Tier Limits

- ✅ **300 emails/day** (9,000/month)
- ✅ **Unlimited contacts**
- ✅ **Email support**
- ✅ **All features** (no restrictions)

**Upgrade if needed:**

- Paid plans start at $9/month
- Higher sending limits
- Priority support

---

## Support & Resources

- **Brevo Documentation:** https://developers.brevo.com/
- **Brevo Support:** https://help.brevo.com/
- **API Reference:** https://developers.brevo.com/api-reference

---

## Quick Reference

### Environment Variables

```env
BREVO_API_KEY=xkeysib-...
NEWSLETTER_SECRET=your-secret-here
```

### Test Commands

```bash
# Test welcome email
npx tsx scripts/test-welcome-email.ts email@example.com

# Check newsletter status
npx tsx scripts/test-auto-newsletter.ts check

# Send newsletters
npx tsx scripts/test-auto-newsletter.ts send
```

### API Endpoints

- `POST /api/subscribe` - Subscribe to newsletter
- `POST /api/welcome-email` - Send welcome email
- `POST /api/auto-newsletter` - Automatic newsletter sending
- `GET /api/auto-newsletter` - Check newsletter status

---

**That's it!** Your newsletter system is ready to use! 🎉

For questions or issues, check the troubleshooting section above.
