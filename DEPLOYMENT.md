# Deployment Guide - Tailer App

## Quick Deploy to Vercel (Recommended - Free)

### Step 1: Deploy with Vercel
1. Go to https://vercel.com
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Paste: `https://github.com/ratheeshkm/tailor-app-nextjs.git`
5. Click **"Import"**

### Step 2: Configure Environment Variables
1. In the "Configure Project" section, click **"Environment Variables"**
2. Add your database connections:
   - **Name:** `DATABASE_URL`
   - **Value:** Your PostgreSQL pooling connection string (from Neon, Supabase, etc.)
3. Optionally add `DIRECT_URL` for migrations:
   - **Name:** `DIRECT_URL`
   - **Value:** Your direct PostgreSQL connection string (non-pooling)
4. Click **"Deploy"**

### Step 3: Get Your Live URL
After deployment completes, you'll get a URL like:
```
https://tailer-app.vercel.app
```

---

## Option A: Use Free Database (Recommended)

### Using Neon (PostgreSQL - Free Tier)
1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Copy the connection string that looks like:
   ```
   postgresql://user:password@host.neon.tech/database?sslmode=require
   ```
5. Use this as your `DATABASE_URL` in Vercel

### Using Supabase (PostgreSQL - Free Tier)
1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Go to Project Settings → Database
5. Copy the URI under "Connection string"
6. Use this as your `DATABASE_URL` in Vercel

---

## After Deployment

### Run Database Migrations
Once deployed:
1. Go to Vercel dashboard
2. Go to **"Settings"** → **"Functions"** 
3. Or use Vercel CLI:
   ```bash
   npm install -g vercel
   vercel env pull
   npx prisma db push
   ```

### Seed Database (Optional)
To add sample data:
```bash
npm run seed
```

---

## Your App Features:

✅ **PWA Ready** - Can be installed as native app
✅ **Offline Support** - Service worker caching
✅ **Mobile Responsive** - Works on all devices
✅ **Dark Mode** - Automatic theme switching
✅ **Database** - PostgreSQL with Prisma ORM

---

## Summary

**Free Hosting:** Vercel (built for Next.js)
**Free Database:** Neon or Supabase
**Total Cost:** $0/month

Your app will be live in minutes!
