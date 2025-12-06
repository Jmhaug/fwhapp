# PowerOffice API Integration Guide

## Overview

Your FWH app now supports automated invoice syncing from PowerOffice, eliminating the need for manual CSV uploads. All invoice data is automatically categorized by company and synced to Supabase.

## Quick Setup

### Step 1: Register as PowerOffice Developer

1. Go to **https://developer.poweroffice.net/**
2. Click **"Get Started"** or **"Register"**
3. Create a developer account (you can use your existing PowerOffice login)
4. Access the developer portal

### Step 2: Get Your API Credentials

In the PowerOffice developer portal, you'll need **three keys**:

1. **Application Key** (unique to your app)
2. **Client Key** (unique per client/company)
3. **Product Subscription Key** (from your subscription)

#### How to Find These:

**Application Key:**
- Go to "Applications" section
- Create a new application for "FWH Sjekkliste"
- Copy the Application Key

**Client Key & Subscription Key:**
- Go to "My Clients" or "Clients" section
- Select your PowerOffice client
- Copy the Client Key
- Go to "Subscriptions" and copy the Product Subscription Key

### Step 3: Add Credentials to .env.local

Open `.env.local` and replace the placeholder values:

```
VITE_POWEROFFICE_APP_KEY=your_actual_application_key
VITE_POWEROFFICE_CLIENT_KEY=your_actual_client_key
VITE_POWEROFFICE_SUBSCRIPTION_KEY=your_actual_subscription_key
VITE_POWEROFFICE_USE_DEMO=false
```

**For Testing (Demo Environment):**
```
VITE_POWEROFFICE_USE_DEMO=true
```

### Step 4: Restart the App

```bash
npm run dev
```

The PowerOffice sync button will now appear in the Sjekkliste (checklist) tab.

## How It Works

### Authentication Flow

1. App sends credentials (Application Key + Client Key) to PowerOffice OAuth endpoint
2. PowerOffice returns an access token (valid for 20 minutes)
3. Token is cached and automatically refreshed when expired
4. All API requests include the token in the Authorization header

### Invoice Syncing

1. Click **"Sync Now"** button in the app
2. App fetches all invoices from PowerOffice
3. Invoices are automatically mapped to companies:
   - **Bemanning** → FWH Bemanning
   - **Eiendom** → FWH Eiendom
   - **Invest** → FWH Invest
4. Invoices are added to the app and synced to Supabase
5. Success message shows number of imported invoices

### Company Mapping

By default, invoices are mapped to companies based on:
- Vendor name (contains "bemanning", "eiendom", or "invest")
- Project name (same criteria)

To customize mapping, pass a `companyMapping` object:

```javascript
const customMapping = {
  'vendor-name': 'bemanning',
  'another-vendor': 'eiendom',
}

<PowerOfficeSync companyMapping={customMapping} />
```

## API Endpoints Used

### OAuth Token Endpoint
```
POST https://goapi.poweroffice.net/OAuth/Token
```
or (Demo):
```
POST https://goapi.poweroffice.net/Demo/OAuth/Token
```

### Invoices Endpoint
```
GET https://goapi.poweroffice.net/v2/Invoices
```
or (Demo):
```
GET https://goapi.poweroffice.net/Demo/v2/Invoices
```

## Code Integration

### Using the PowerOffice Service

```javascript
import powerofficeService from './services/poweroffice'

// Check if configured
if (powerofficeService.isConfigured()) {
  // Sync invoices
  const syncedInvoices = await powerofficeService.syncInvoices()
  console.log(syncedInvoices)
  // Returns: { bemanning: [...], eiendom: [...], invest: [...] }
}

// Get access token (handles caching & refresh)
const token = await powerofficeService.getAccessToken()

// Get all invoices
const invoices = await powerofficeService.getInvoices()

// Get single invoice
const invoice = await powerofficeService.getInvoice(invoiceId)
```

### PowerOfficeSync Component

Add to your UI:

```jsx
import PowerOfficeSync from './components/PowerOfficeSync'

<PowerOfficeSync
  darkMode={darkMode}
  onSyncComplete={(syncedData) => {
    // Handle synced invoices
    console.log('Synced:', syncedData)
  }}
  companyMapping={customMapping}
/>
```

## Troubleshooting

### "PowerOffice Not Configured" Message

**Problem:** The sync button shows a warning instead of working.

**Solution:**
1. Check that `.env.local` has all three PowerOffice keys
2. Verify keys are not empty or "your_xxx_here" placeholders
3. Restart the dev server: `npm run dev`

### Authentication Failed

**Error:** `"PowerOffice authentication failed: 401"`

**Solution:**
- Verify Application Key and Client Key are correct
- Ensure Subscription Key is from your active subscription
- Check PowerOffice developer portal for any API restrictions
- Try with `VITE_POWEROFFICE_USE_DEMO=true` to test with demo environment

### No Invoices Imported

**Problem:** Sync completes but no invoices appear.

**Solution:**
1. Verify the PowerOffice client has invoices
2. Check company mapping rules match your vendor names
3. Open browser DevTools (F12) → Console for error details
4. Try importing from demo environment first

### Token Expiry Issues

**Problem:** Sync works once, then fails.

**Solution:**
- The app automatically handles token refresh (every 19 minutes)
- Service caches tokens and refreshes before expiry
- If issues persist, clear browser cache and restart

## File Locations

- **Service Module**: `src/services/poweroffice.js`
- **UI Component**: `src/components/PowerOfficeSync.jsx`
- **Environment Variables**: `.env.local`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_POWEROFFICE_APP_KEY` | Your registered application key | `abc123...` |
| `VITE_POWEROFFICE_CLIENT_KEY` | PowerOffice client identifier | `xyz789...` |
| `VITE_POWEROFFICE_SUBSCRIPTION_KEY` | Product subscription key | `sub123...` |
| `VITE_POWEROFFICE_USE_DEMO` | Use demo environment for testing | `true` or `false` |

## Security Notes

- **Never commit** `.env.local` to git (already in .gitignore)
- Keep API keys confidential
- In production, use environment management (Vercel, AWS, etc.)
- Rotation: If keys are compromised, regenerate in PowerOffice portal

## Next Steps

1. ✅ Register developer account at https://developer.poweroffice.net/
2. ✅ Get your three API credentials
3. ✅ Add credentials to `.env.local`
4. ✅ Restart the app with `npm run dev`
5. ✅ Test sync with "Sync Now" button
6. ✅ Monitor Supabase for synced invoices

## Support

For detailed PowerOffice API documentation:
- Developer Portal: https://developer.poweroffice.net/
- API Reference: https://developer.poweroffice.net/documentation/
- Support Email: go-api@poweroffice.no

---

**Last Updated**: 2025-12-06
**Status**: ✅ Ready to configure
