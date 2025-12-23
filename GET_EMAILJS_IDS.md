# How to Get EmailJS Template ID and Public Key

Follow these simple steps to get your Template ID and Public Key from EmailJS.

## Step 1: Get Your Public Key (User ID)

1. **Log in to EmailJS:**

   - Go to https://www.emailjs.com/
   - Sign in to your account

2. **Go to Account Settings:**

   - Click on your **profile icon** (top right corner)
   - OR click **"Account"** in the left sidebar
   - OR go directly to: https://dashboard.emailjs.com/admin

3. **Find Your Public Key:**

   - Look for **"Public Key"** or **"User ID"** section
   - It will look something like: `user_xxxxxxxxxxxxx` or just `xxxxxxxxxxxxx`
   - **Copy this value** - this is your `EMAILJS_PUBLIC_KEY`

   **Location:** Usually in the "General" or "Account" tab of your dashboard

---

## Step 2: Create Email Template and Get Template ID

### Part A: Create the Template

1. **Go to Email Templates:**

   - In EmailJS dashboard, click **"Email Templates"** in the left sidebar
   - OR go to: https://dashboard.emailjs.com/admin/integration

2. **Create New Template:**

   - Click **"Create New Template"** button (usually green/blue button)
   - OR click the **"+"** icon

3. **Template Settings:**

   - **Template Name:** `Newsletter Welcome Email` (or any name you like)
   - **Subject:** `{{subject}}`

4. **Template Content:**

   - In the template editor, use this structure:

   ```
   To: {{to_email}}
   From: {{from_name}} <{{from_email}}>
   Reply-To: {{reply_to}}
   Subject: {{subject}}

   {{message_html}}
   ```

   **Important Notes:**

   - Make sure the template accepts **HTML content**
   - The variable `{{message_html}}` will contain the full HTML email
   - You can also add plain text fallback if needed

5. **Save the Template:**
   - Click **"Save"** button
   - The template is now created

### Part B: Get Your Template ID

1. **After saving, you'll see your template in the list**

2. **Find the Template ID:**

   - Look at the template card/list item
   - The Template ID is usually shown as:
     - `template_xxxxxxx` (with "template\_" prefix)
     - OR just `xxxxxxx` (the ID number)
   - It might be in the URL when you click on the template
   - OR shown in the template details/settings

3. **Copy the Template ID:**
   - Click on the template to open it
   - Look in the URL: `https://dashboard.emailjs.com/admin/template/xxxxxxx`
     - The `xxxxxxx` part is your Template ID
   - OR check the template settings/details page
   - **Copy this value** - this is your `EMAILJS_TEMPLATE_ID`

---

## Step 3: Verify Your Service ID

You already have: `service_7nmxoqi`

To verify it's correct:

1. Go to **"Email Services"** in EmailJS dashboard
2. Find your service (should show as connected/active)
3. Make sure it says `service_7nmxoqi` or shows this ID

---

## Step 4: Add to Environment Variables

Once you have all three values:

### For Local Development (`.env.local`):

Create or edit `.env.local` in your project root:

```bash
EMAILJS_SERVICE_ID=service_7nmxoqi
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PUBLIC_KEY=user_xxxxxxxxxxxxx
```

Replace:

- `template_xxxxxxx` with your actual Template ID
- `user_xxxxxxxxxxxxx` with your actual Public Key

### For Production:

Add the same three variables to your hosting platform:

**Vercel:**

- Project → Settings → Environment Variables
- Add all three variables

**Netlify:**

- Site Settings → Build & Deploy → Environment
- Add all three variables

---

## Quick Checklist

- [ ] Public Key: Found in Account/General settings
- [ ] Template Created: Created in Email Templates section
- [ ] Template ID: Copied from template URL or details
- [ ] Service ID: Verified as `service_7nmxoqi`
- [ ] Environment Variables: Added to `.env.local`
- [ ] Server Restarted: Restarted dev server after adding variables

---

## Troubleshooting

### Can't find Public Key?

- Look in "Account" → "General" or "Settings"
- It might be called "User ID" instead of "Public Key"
- Check the API section of your dashboard

### Can't find Template ID?

- Click on your template to open it
- Check the browser URL - the ID is in the URL
- Look in template settings/details
- It might be shown as a code/ID field in the template editor

### Template not working?

- Make sure template uses `{{message_html}}` for HTML content
- Verify all variable names match exactly
- Check that template is saved and published

---

## Example Values (What They Look Like)

**Service ID:**

```
service_7nmxoqi
```

**Template ID:**

```
template_abc123xyz
```

or

```
abc123xyz
```

**Public Key:**

```
user_abcdefghijklmnopqrstuvwxyz
```

or

```
abcdefghijklmnopqrstuvwxyz
```

---

## Need Help?

If you're stuck:

1. Check EmailJS dashboard → "Email Logs" for errors
2. Verify all three IDs are correct
3. Make sure template uses the correct variable names
4. Restart your dev server after adding environment variables

Once you have all three values, add them to `.env.local` and restart your server! 🚀
