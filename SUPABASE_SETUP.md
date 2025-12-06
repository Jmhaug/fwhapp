# Supabase Setup Guide

Your Supabase project is now connected to the FWH Sjekkliste app!

## Database Table Setup

Run this SQL in your Supabase SQL Editor to create the required table:

```sql
-- Create table for FWH data
CREATE TABLE IF NOT EXISTS public.fwh_data (
    id TEXT PRIMARY KEY,
    data_json JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set row-level security
ALTER TABLE public.fwh_data ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users (read/write)
CREATE POLICY "Allow anonymous access" ON public.fwh_data
    FOR ALL USING (true)
    WITH CHECK (true);
```

Or alternatively, use the Supabase web interface:

## Steps to Create Table in Web UI:

1. Go to your Supabase project: https://asfpequjxovcpfkekcao.supabase.co
2. Click "SQL Editor" on the left sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run"
6. Go to "Database" → "Tables" and verify `fwh_data` table exists

## Environment Variables (Already Set)

Your `.env.local` file already contains:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## How It Works

✅ **Auto-sync**: All data changes are automatically synced to Supabase every 500ms
✅ **Offline-first**: Works without internet, syncs when connection restored
✅ **Status indicator**: Shows "⚙️ Syncing..." or "☁️ Synced" in header
✅ **Fallback**: Uses localStorage if Supabase is unreachable

## Data Structure

The app stores all data in a single `fwh_data` table record with this structure:

```json
{
  "id": "fwh_main",
  "data_json": {
    "bemanning": {
      "tasks": [...],
      "invoices": [...],
      "recurringPaid": [...]
    },
    "eiendom": {
      "tasks": [...],
      "invoices": [...],
      "recurringPaid": [...]
    },
    "invest": {
      "tasks": [...],
      "invoices": [...],
      "recurringPaid": [...]
    }
  },
  "updated_at": "2025-12-06T22:00:00Z",
  "created_at": "2025-12-06T21:00:00Z"
}
```

## Testing Sync

1. Start the app: `npm run dev`
2. Open http://localhost:3000
3. Add a task or mark a recurring invoice as paid
4. Look for "☁️ Synced" indicator in the header
5. Open another browser tab to the same URL
6. You should see your changes reflected automatically!

## Troubleshooting

**"☁️ Synced" not showing?**
- Check that `.env.local` has correct credentials
- Verify table exists in Supabase SQL Editor
- Check browser console for errors (F12)

**Data not persisting?**
- localStorage works offline (no internet needed)
- Supabase sync only works with internet connection
- Both are enabled - if Supabase fails, localStorage is used as fallback

**Can't connect to Supabase?**
- Verify credentials are correct in `.env.local`
- Check that table has RLS policies allowing public access
- Check Supabase status at https://status.supabase.com

## Column Types in Supabase

| Column | Type | Purpose |
|--------|------|---------|
| `id` | TEXT | Primary key (always "fwh_main") |
| `data_json` | JSONB | All app data (tasks, invoices, recurring) |
| `updated_at` | TIMESTAMP | Last sync time |
| `created_at` | TIMESTAMP | Record creation time |

---

**Your Supabase URL**: https://asfpequjxovcpfkekcao.supabase.co
**Project ID**: asfpequjxovcpfkekcao
