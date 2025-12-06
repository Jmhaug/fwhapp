# FWH Sjekkliste - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

---

## 📋 What You Can Do

### 1️⃣ Sjekkliste Tab (Tasks & Invoices)
- **Add daily tasks** and mark them complete
- **Track ad-hoc invoices** (one-time or custom)
- **See progress bars** for task completion
- **Switch between divisions** (Eiendom, Invest, Bemanning)

### 2️⃣ Gjentakende fakturaer Tab (Recurring Invoice Checklist)
- **Pre-filled with all recurring vendors** from CSV analysis
- **Mark invoices as paid** this month by clicking them
- **See payment progress** (e.g., 3/11 paid)
- **View monthly & quarterly costs** per division
- **Click vendors to toggle paid status** ✓

### 3️⃣ Dashboard Tab (Analytics & Graphs)
- **View total statistics** (total invoices, completion rate, etc.)
- **See invoices by division** (bar chart)
- **View task completion** by division (stacked chart)
- **Check cost breakdown** (pie chart of monthly recurring)
- **Compare costs** between divisions (progress bars)

### 4️⃣ Dark Mode
- **Click the Moon/Sun icon** in top right to toggle
- **Theme preference is saved** automatically

---

## 📊 Analysis Results Summary

**252 invoices analyzed** across **3 divisions** from **2023-2025**

### Quick Numbers
- **FWH Eiendom**: 2 recurring vendors (~5,084 NOK/month)
- **FWH Invest**: 6 recurring vendors (~5,682 NOK/month)
- **FWH Bemanning**: 3 recurring vendors (~964 NOK/month)

### Biggest Recurring Costs
1. Skatteetaten - 36,038.55 NOK (quarterly)
2. Fwh Eiendom AS - 7,612.50 NOK (bi-monthly)
3. Sameiet Fanatorget - 6,829.67 NOK (bi-monthly)
4. Accountor AS - 4,974.27 NOK (monthly)

**See `ANALYSIS_REPORT.md` for full details**

---

## 💾 Data Storage

### Local Storage (Automatic)
- All your tasks and invoices save to browser storage
- Data persists when you close and reopen
- No account needed

### Supabase (Optional)
- To sync data to cloud database:
  1. Create free account at https://supabase.com
  2. Copy your URL and API key
  3. Create `.env.local` file:
     ```
     VITE_SUPABASE_URL=your_url_here
     VITE_SUPABASE_ANON_KEY=your_key_here
     ```
  4. Restart development server
  5. Data will auto-sync to Supabase

---

## 🔄 Update Recurring Invoices from CSV

If invoice CSVs change or you add new files:

```bash
python3 analyze_invoices.py
```

This will:
- ✅ Re-analyze all CSV files
- ✅ Detect any new recurring patterns
- ✅ Update `recurring_invoices.json`
- ✅ Generate new `ANALYSIS_REPORT.md`

---

## 🎨 Features

### ✨ Modern UI
- Smooth animations on all interactions
- Gradient backgrounds
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode

### 📊 Analytics
- Real-time statistics
- Interactive charts (Recharts)
- Progress tracking
- Cost comparisons

### 🛠️ Tech Stack
- React 18 (UI)
- Vite (Fast build tool)
- Tailwind CSS (Styling)
- Recharts (Charts/Graphs)
- Lucide React (Icons)
- Supabase (Optional backend)

---

## 📁 Project Structure

```
fwhapp/
├── src/
│   ├── App.jsx                          # Main app with 3 tabs
│   ├── index.css                        # Tailwind styles
│   ├── main.jsx                         # React entry point
│   ├── components/
│   │   ├── CompanyTabs.jsx              # Division selector
│   │   ├── TaskSection.jsx              # Tasks & checklist
│   │   ├── TaskInput.jsx                # Task input form
│   │   ├── TaskList.jsx                 # Task list display
│   │   ├── InvoiceSection.jsx           # Invoice tracking
│   │   ├── InvoiceInput.jsx             # Invoice input form
│   │   ├── InvoiceList.jsx              # Invoice list display
│   │   ├── RecurringInvoices.jsx        # Recurring invoice checklist
│   │   └── Dashboard.jsx                # Analytics & graphs
│   └── lib/
│       └── supabase.js                  # Supabase config
├── analyze_invoices.py                  # CSV analysis script
├── recurring_invoices.json              # Analysis output
├── ANALYSIS_REPORT.md                   # Detailed analysis
├── QUICK_START.md                       # This file
├── README.md                            # Full documentation
├── package.json                         # Dependencies
├── vite.config.js                       # Vite config
└── tailwind.config.js                   # Tailwind config
```

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- --port 3001
```

### Changes not showing?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try hard refresh (Ctrl+F5)
3. Restart dev server (stop with Ctrl+C, then `npm run dev`)

### Dark mode not working?
- Dark mode uses browser's `localStorage`
- Make sure localStorage is enabled
- Check that cookies aren't blocked

### Data lost after refresh?
- If using localStorage only (no Supabase), data should persist
- If cleared browser data, localStorage gets wiped
- Set up Supabase for persistent cloud backup

---

## 📧 Support

For issues or questions:
- Check `ANALYSIS_REPORT.md` for data insights
- See `README.md` for full feature documentation
- Review `analyze_invoices.py` for CSV analysis logic

---

**Happy tracking! 🎉**

Last updated: 2025-12-06
