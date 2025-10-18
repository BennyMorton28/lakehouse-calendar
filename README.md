# Lake House Calendar

A beautiful, mobile-first web app for coordinating family weekends at the lake house. Built with React, Tailwind CSS, and Supabase.

## 🚀 Quick Links

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 10 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Detailed deployment instructions
- **[Features Overview](./FEATURES.md)** - Complete feature list and technical details
- **[Supabase Setup](./SUPABASE_SETUP.md)** - Database configuration guide

## Features

- **Mobile-First Design**: Optimized for phones and tablets with large touch targets
- **Real-Time Sync**: Everyone sees updates instantly across all devices
- **Color-Coded Family Members**: Easy visual identification with unique colors per person
- **Status Tracking**: Mark interest as "Tentative" or "Confirmed"
- **Quick View**: See at a glance which weekends are popular
- **Notes**: Add notes for each weekend visit
- **Easy Navigation**: Swipe or tap to move between months

## Family Members

- Steve (Blue)
- Nehama (Pink)
- Adam (Green)
- Meredith (Amber)
- Ben (Purple)
- Rachel (Red)
- Maya (Cyan)
- Jake (Orange)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Backend

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a free Supabase account
- Set up the database table
- Get your API credentials
- Configure the `.env` file

### 3. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" > "Import an existing project"
4. Connect to your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
7. Click "Deploy site"

Your app will be live at `https://your-site-name.netlify.app`

## Usage

### Viewing the Calendar

- The calendar opens to the current month
- Weekends are clickable
- Colored circles show who's interested in each weekend
- ✓ indicates confirmed attendance
- ? indicates tentative interest

### Adding Interest

1. Tap on any weekend
2. Select a family member from the dropdown
3. Choose "Tentative" or "Confirmed"
4. Optionally add notes
5. Tap "Add Interest"

### Editing or Removing

- To change status: Add the person again with the new status
- To remove: Tap the trash icon next to the person's name

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Date Utilities**: date-fns
- **Deployment**: Netlify

## License

Private family project
