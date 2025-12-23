# Fix: Gmail API Insufficient Authentication Scopes

If you're getting the error: **"412 Gmail_API: Request had insufficient authentication scopes"**, here's how to fix it:

## Quick Fix (Recommended)

### Option 1: Reconnect Gmail with Full Permissions

1. **Go to EmailJS Dashboard:**

   - Visit https://www.emailjs.com/
   - Log in to your account
   - Go to **"Email Services"**

2. **Delete the existing Gmail service:**

   - Find your Gmail service
   - Click the delete/remove button
   - Confirm deletion

3. **Create a new Gmail service:**

   - Click **"Add New Service"**
   - Select **"Gmail"**
   - Click **"Connect Account"**

4. **When Google asks for permissions:**

   - ⚠️ **CRITICAL:** Make sure to click **"Allow"** for ALL permissions
   - Don't click "Cancel" or "Limit"
   - Don't restrict any scopes
   - The service needs full email sending permissions

5. **Verify the connection:**
   - You should see "Connected" status
   - Copy your new Service ID

---

### Option 2: Use Gmail SMTP (More Reliable)

If Gmail API keeps having issues, use SMTP instead:

1. **In EmailJS Dashboard:**

   - Go to "Email Services"
   - Click "Add New Service"
   - Look for **"Gmail SMTP"** or **"SMTP"** option
   - If not available, select **"Custom SMTP"**

2. **SMTP Settings for Gmail:**

   ```
   Host: smtp.gmail.com
   Port: 587
   Username: abhinavsingh9986@gmail.com
   Password: [Use Gmail App Password - see below]
   ```

3. **Create Gmail App Password:**

   - Go to https://myaccount.google.com/
   - Security → 2-Step Verification (must be enabled)
   - App Passwords → Generate new app password
   - Use this password (not your regular Gmail password)

4. **Test the connection:**
   - EmailJS will test the SMTP connection
   - Copy your Service ID when successful

---

### Option 3: Use a Different Email Provider

If Gmail continues to have issues, consider:

**Outlook/Hotmail:**

- Easier setup
- Less permission issues
- Same free tier

**Yahoo:**

- Also works well
- Similar setup process

---

## Why This Happens

Gmail API requires specific OAuth scopes to send emails. If you:

- Limited permissions during setup
- Used "Limited Access" mode
- Didn't grant all requested permissions

Then you'll get the "insufficient scopes" error.

## Prevention

When connecting Gmail:

- ✅ Always click "Allow" for all permissions
- ✅ Don't use "Limited Access" mode
- ✅ Grant full email sending permissions
- ✅ Consider using SMTP for more reliability

## After Fixing

1. Update your `.env.local` with the new Service ID
2. Restart your dev server
3. Test the welcome email again

The error should be resolved! 🎉
