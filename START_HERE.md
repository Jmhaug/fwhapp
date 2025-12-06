# 🚀 FWH Sjekkliste - Start Here!

## What You're Getting

A **modern, cloud-synced invoice & task management app** for FWH with:
- ☁️ Supabase cloud storage
- 📱 Mobile-responsive design
- 🎨 Dark/light mode
- 📊 Analytics dashboard
- 📅 Monthly recurring invoice tracking
- 🔄 Real-time multi-device sync

## Quick Setup (5 minutes)

### Step 1: Create Supabase Table

1. Go to your Supabase dashboard: https://asfpequjxovcpfkekcao.supabase.co
2. Click **SQL Editor** in the left menu
3. Click **+ New Query**
4. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS public.fwh_data (
    id TEXT PRIMARY KEY,
    data_json JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.fwh_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access" ON public.fwh_data
    FOR ALL USING (true)
    WITH CHECK (true);
```

5. Click **Run** (bottom right button)
6. You should see "Success" message

### Step 2: Start the App

```bash
cd /Users/jamesm/projects/fwhapp
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

## What You'll See

### Header
- **Title**: "FWH Sjekkliste"
- **Month Badge**: "December 2025" (auto-updates)
- **Sync Status**: "☁️ Synced" or "⚙️ Syncing..."
- **Dark Mode Button**: Moon/Sun icon (top right)

### Company Buttons (New Order)
```
[FWH Bemanning] [FWH Eiendom] [FWH Invest]
     ↑ Default
```

### Three Tabs
1. **Gjentakende fakturaer** ← Default
   - Mark monthly/quarterly invoices as paid
   - See progress bar for month
   - View estimated costs

2. **Dashboard**
   - Interactive charts
   - Cost breakdown by company
   - Task completion stats

3. **Sjekkliste**
   - Add custom tasks
   - Add ad-hoc invoices
   - Mark tasks complete

## 📊 Pre-loaded Data

All companies have **pre-populated recurring invoices** based on your CSV analysis:

**FWH Bemanning** (9 vendors)
- Skatteetaten: 52,170 NOK quarterly
- Fwh Eiendom AS: 15,680 NOK bi-monthly
- Accountor AS: 6,388.09 NOK monthly
- ...and 6 more

**FWH Eiendom** (4 vendors)
- Sameiet Fanatorget: 6,829.67 NOK bi-monthly
- Accountor AS: 3,528.36 NOK monthly
- Bergen kommune: 2,555.64 NOK bi-monthly
- PowerOffice AS: 542.05 NOK monthly

**FWH Invest** (2 vendors)
- Accountor AS: 3,442.00 NOK monthly
- PowerOffice AS: 504.20 NOK monthly

## 💡 How to Use

### Mark Recurring Invoice as Paid
1. Go to "Gjentakende fakturaer" tab (default)
2. Click on any vendor name
3. It will show a checkmark ✓ when paid
4. Progress bar at top shows how many paid this month

### Add Custom Task
1. Go to "Sjekkliste" tab
2. Type task in "Legg til oppgave..." field
3. Click "Legg til" or press Enter
4. Check the box when done

### Add Ad-hoc Invoice
1. Go to "Sjekkliste" tab
2. Enter vendor name and amount
3. Click "Legg til"
4. See total amount update automatically

### View Dashboard Stats
1. Go to "Dashboard" tab
2. See total invoices by company
3. View task completion charts
4. Compare costs between divisions

## 🔄 Sync Magic

Everything syncs **automatically** across all devices:

1. **Make a change** on your phone
2. **See it instantly** on your laptop
3. **Works offline** - syncs when back online
4. **Zero manual saves** - automatic!

## 🌙 Dark Mode

Click the **Moon icon** (top right) to toggle:
- ☀️ Light mode (default)
- 🌙 Dark mode (easier on eyes)

Preference saves automatically.

## ✅ Verification Checklist

- [ ] Supabase table created successfully
- [ ] App starts with `npm run dev`
- [ ] Can see current month in header
- [ ] Can see "☁️ Synced" indicator
- [ ] Dark mode toggle works
- [ ] Can see all 3 company buttons
- [ ] Can click between tabs
- [ ] Can add task in Sjekkliste tab
- [ ] Can mark recurring invoice as paid

## 🐛 If Something Doesn't Work

**App won't start?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**No sync indicator?**
- Check `.env.local` file exists
- Verify Supabase table was created (see SQL Editor)
- Open browser DevTools (F12) → Console for errors

**Can't see data from another device?**
- Check that Supabase table exists with RLS policy
- Ensure both devices logged into same Supabase project
- Try hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

**Port 3000 in use?**
```bash
npm run dev -- --port 3001
```

## 📚 Full Documentation

See these files for detailed info:
- **UPDATES_SUMMARY.md** - All changes made
- **SUPABASE_SETUP.md** - Detailed Supabase setup
- **README.md** - Feature documentation
- **QUICK_START.md** - Alternative quick start

## 🎯 What's Next?

1. ✅ Create Supabase table (see Step 1 above)
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:3000
4. ✅ Start using!

---

**Status**: ✅ Ready to use
**Last Updated**: 2025-12-06
**Environment**: Development (Vite + React 18)

**Questions?** Check the documentation files above!
