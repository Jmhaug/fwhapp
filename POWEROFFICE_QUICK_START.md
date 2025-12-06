# PowerOffice Integration - Quick Start

Your FWH Sjekkliste app now supports automatic invoice syncing from PowerOffice!

## 5-Minute Setup

### Step 1: Register as Developer (2 min)
Go to **https://developer.poweroffice.net/** and register

### Step 2: Get API Keys (2 min)
From the PowerOffice developer portal, collect:
- **Application Key** (unique to your app)
- **Client Key** (for your PowerOffice client)
- **Product Subscription Key** (from your subscription)

### Step 3: Update .env.local (1 min)

Open `.env.local` and replace:
```
VITE_POWEROFFICE_APP_KEY=your_actual_key_here
VITE_POWEROFFICE_CLIENT_KEY=your_actual_key_here
VITE_POWEROFFICE_SUBSCRIPTION_KEY=your_actual_key_here
VITE_POWEROFFICE_USE_DEMO=false
```

### Step 4: Restart App
```bash
npm run dev
```

## Using PowerOffice Sync

1. Open your app → **Sjekkliste** tab
2. Click **"Sync Now"** button (blue button with cloud icon)
3. Wait for sync to complete
4. Success message shows number of imported invoices
5. Invoices appear in your app and sync to Supabase automatically

## How It Maps Invoices

Invoices are automatically assigned to companies based on vendor/project names:
- Contains "bemanning" → **FWH Bemanning**
- Contains "eiendom" → **FWH Eiendom**
- Contains "invest" → **FWH Invest**

## Testing with Demo Mode

To test before using production credentials:

```
VITE_POWEROFFICE_USE_DEMO=true
```

This uses PowerOffice's demo environment for safe testing.

## Troubleshooting

**"PowerOffice Not Configured"?**
- Check `.env.local` has all three keys
- Keys should NOT be empty or say "your_actual_key_here"
- Restart app after updating .env.local

**Sync fails with "401"?**
- Verify credentials are correct
- Check they're from the same PowerOffice project
- Try demo mode first: `VITE_POWEROFFICE_USE_DEMO=true`

**No invoices imported?**
- Verify PowerOffice client has invoices
- Check vendor names match mapping rules
- Open DevTools (F12) → Console for error details

## Full Documentation

See `POWEROFFICE_INTEGRATION.md` for:
- Detailed API documentation
- Security best practices
- Authentication details
- Custom company mapping
- Advanced configuration

---

**Ready?** Get your PowerOffice keys from https://developer.poweroffice.net/ and update `.env.local`!
