# Supabase Setup Instructions

## 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project (choose a name like "lakehouse-calendar")
4. Wait for the project to be provisioned

## 2. Create the Database Table

1. In your Supabase dashboard, go to the **SQL Editor** (in the left sidebar)
2. Click **New Query**
3. Paste the following SQL and click **Run**:

```sql
-- Create the weekend_interests table
CREATE TABLE weekend_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekend_date DATE NOT NULL,
  person_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('tentative', 'confirmed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create an index on weekend_date for faster queries
CREATE INDEX idx_weekend_date ON weekend_interests(weekend_date);

-- Create an index on person_name for faster queries
CREATE INDEX idx_person_name ON weekend_interests(person_name);

-- Enable Row Level Security (RLS)
ALTER TABLE weekend_interests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since this is a private family app)
CREATE POLICY "Allow all operations" ON weekend_interests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE weekend_interests;
```

## 3. Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## 4. Configure Your App

1. In your project root, create a file named `.env`
2. Add your credentials:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file

## 5. You're Done!

Your Supabase backend is now set up and ready to use. The app will automatically:
- Store all weekend interests in the database
- Sync data in real-time across all devices
- Allow anyone to view and add interests

## Notes

- The free tier includes:
  - 500 MB database space
  - 5 GB bandwidth per month
  - 2 GB file storage
  - This is more than enough for a family calendar app!

- Row Level Security (RLS) is enabled but set to allow all operations since this is a private family app
- If you want to add authentication later, you can modify the RLS policies

## Troubleshooting

If data isn't loading:
1. Check that your `.env` file has the correct credentials
2. Make sure the `.env` file is in the project root
3. Restart the dev server (`npm run dev`)
4. Check the browser console for errors
