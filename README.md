This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Newsletter Setup

This blog includes a newsletter subscription feature powered by [Resend](https://resend.com).

### Step 1: Create a Resend Account

1. Sign up at [resend.com](https://resend.com)
2. Verify your email address

### Step 2: Get Your API Key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Blog Newsletter")
4. Copy the API key (starts with `re_`)

### Step 3: Create an Audience

You have two options:

#### Option A: Using the Dashboard (Recommended)

1. Go to [Resend Audiences](https://resend.com/audiences)
2. Click "Create Audience" or "New Audience"
3. Enter a name (e.g., "Newsletter Subscribers")
4. Click "Create" or "Save"
5. Click on the audience you just created
6. Copy the **Audience ID** (it's a UUID like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### Option B: Using the Script (Automated)

1. Make sure you have your `RESEND_API_KEY` in `.env.local`
2. Run the script:
   ```bash
   npx tsx scripts/create-audience.ts "Newsletter Subscribers"
   ```
3. The script will output the Audience ID - copy it

### Step 4: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Replace the values with your actual API key and Audience ID.

The newsletter subscription form appears on:

- Home page (after featured posts)
- Blog listing page (after posts list)
- Individual blog post pages (after article content)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important:** Don't forget to add your `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` environment variables in your Vercel project settings.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
