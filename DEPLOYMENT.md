# Deployment Guide

## Quick Start

Your code is already on GitHub at: https://github.com/BennyMorton28/lakehouse-calendar

## Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project called "lakehouse-calendar"
3. Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
   - Create the database table (copy/paste the SQL)
   - Get your API credentials

## Step 2: Deploy to Netlify (5 minutes)

### Option A: Deploy via Netlify UI (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select the `lakehouse-calendar` repository
4. Configure the build settings (these should auto-populate):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Add environment variables"** and add:
   - **Key**: `VITE_SUPABASE_URL`
     **Value**: Your Supabase project URL (from Step 1)
   - **Key**: `VITE_SUPABASE_ANON_KEY`
     **Value**: Your Supabase anon key (from Step 1)
6. Click **"Deploy site"**

Your site will be live in 2-3 minutes at `https://your-site-name.netlify.app`

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## Step 3: Custom Domain (Optional)

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

## Step 4: Share with Family

Send everyone the link to your deployed site:
- They can bookmark it on their phones
- On iOS: Tap Share → Add to Home Screen (makes it feel like a native app!)
- On Android: Tap Menu → Add to Home Screen

## Updating the App

Whenever you push changes to GitHub:

```bash
git add .
git commit -m "Description of changes"
git push
```

Netlify will automatically rebuild and redeploy your site!

## Troubleshooting

### App shows "Loading..." forever
- Check that you've added the Supabase environment variables in Netlify
- Make sure the credentials are correct (no extra spaces)
- Redeploy the site after adding environment variables

### Data not syncing
- Check the browser console for errors
- Verify the database table was created correctly in Supabase
- Make sure the RLS policies are set up (see SUPABASE_SETUP.md)

### Build fails
- Check the deploy logs in Netlify
- Make sure all dependencies are in package.json
- Try building locally: `npm run build`

## Need Help?

Check the [README.md](./README.md) for more information.
