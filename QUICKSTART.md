# Quick Start Guide

Get your Lake House Calendar up and running in 10 minutes!

## 🚀 Fast Track

### 1. Set Up Supabase (5 min)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project: "lakehouse-calendar"
3. Go to SQL Editor → New Query
4. Copy/paste this SQL and click Run:

```sql
CREATE TABLE weekend_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekend_date DATE NOT NULL,
  person_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('tentative', 'confirmed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX idx_weekend_date ON weekend_interests(weekend_date);
CREATE INDEX idx_person_name ON weekend_interests(person_name);

ALTER TABLE weekend_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON weekend_interests
  FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE weekend_interests;
```

5. Go to Settings → API → Copy:
   - Project URL
   - anon/public key

### 2. Deploy to Netlify (5 min)

1. Sign in at [netlify.com](https://netlify.com) with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select `lakehouse-calendar` repository
4. Add environment variables:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click "Deploy site"

### 3. Done! 🎉

Your site will be live at `https://[your-site].netlify.app` in 2-3 minutes.

Share the link with your family!

## 📱 Mobile Tips

**iOS**:
- Open the site in Safari
- Tap the Share button
- Tap "Add to Home Screen"
- Now it works like a native app!

**Android**:
- Open the site in Chrome
- Tap the menu (⋮)
- Tap "Add to Home screen"

## 💡 Using the App

1. **Browse**: Swipe or tap arrows to change months
2. **Plan**: Tap any weekend to add interest
3. **Track**: See colored circles for each person interested
4. **Confirm**: Mark as "Tentative" (?) or "Confirmed" (✓)
5. **Notes**: Add details about each weekend

## 🎨 Colors

- Steve - Blue
- Nehama - Pink
- Adam - Green
- Meredith - Amber
- Ben - Purple
- Rachel - Red
- Maya - Cyan
- Jake - Orange

## 🆘 Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.
