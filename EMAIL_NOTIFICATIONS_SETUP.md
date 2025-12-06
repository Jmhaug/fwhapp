# Email Notifications Setup Guide

This guide explains how to set up automated email notifications for the FWH Sjekkliste app.

## Overview

The email notification system automatically sends status reports on the **15th and 30th of each month**, containing:

- Number of unpaid recurring invoices per company
- Number of uncompleted tasks per company
- Upcoming due dates for recurring payments
- Status summary for all three companies (FWH Bemanning, FWH Eiendom, FWH Invest)

## Prerequisites

- Supabase account (https://supabase.com)
- Supabase CLI installed (`npm install -g supabase`)
- Email service provider (Resend, SendGrid, or similar)

## Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your notification email to `.env.local`:
   ```
   VITE_NOTIFICATION_EMAIL=your.email@example.com
   ```

## Step 2: Set Up Supabase Edge Function

### 2.1 Initialize Supabase Project (if not done)

```bash
supabase init
supabase login
supabase link --project-ref your-project-ref
```

### 2.2 Create the Email Edge Function

Create a new edge function:

```bash
supabase functions new send-email
```

### 2.3 Install Resend (Recommended Email Service)

Resend offers a free tier with 3,000 emails/month. Sign up at https://resend.com

### 2.4 Add Edge Function Code

Edit `supabase/functions/send-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'FWH Sjekkliste <noreply@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
```

### 2.5 Deploy the Edge Function

```bash
supabase functions deploy send-email --no-verify-jwt
```

### 2.6 Set Resend API Key as Secret

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

## Step 3: Configure Domain (Resend)

To send emails from your own domain:

1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records provided by Resend to your domain provider
4. Wait for verification (usually takes a few minutes)
5. Update the `from` address in the edge function to use your domain

## Step 4: Enable Automatic Notifications in App

Update `src/App.jsx` to enable automatic email checks:

```javascript
import { scheduleNotificationCheck } from './services/emailNotification'

// Inside the App component, add this useEffect
useEffect(() => {
  const recipientEmail = import.meta.env.VITE_NOTIFICATION_EMAIL
  if (recipientEmail && recipientEmail !== 'your_email@example.com') {
    scheduleNotificationCheck(data, RECURRING_INVOICES, recipientEmail)
  }
}, [data])
```

## Step 5: Test the Email System

### Manual Test

You can manually trigger an email by calling the function in the browser console:

```javascript
import { sendEmailNotification } from './services/emailNotification'

// Get the data from localStorage or app state
const data = JSON.parse(localStorage.getItem('fwhData'))

// Send test email
sendEmailNotification(data, RECURRING_INVOICES, 'test@example.com')
```

### Test the Edge Function Directly

```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"to":"test@example.com","subject":"Test Email","html":"<p>Test content</p>"}'
```

## How It Works

### Automatic Scheduling

The notification system:

1. **Checks every hour** if today is the 15th or 30th of the month
2. **Stores last notification date** in localStorage to avoid duplicate emails
3. **Calculates next due dates** for all recurring invoices based on:
   - Last invoice date
   - Payment frequency (Monthly, Bi-Monthly, Quarterly, Annual)
4. **Generates HTML email** with:
   - Summary of unpaid invoices and uncompleted tasks per company
   - List of upcoming due dates sorted by date
   - Color-coded status indicators
5. **Sends via Supabase Edge Function** to your configured email address

### Due Date Calculation

The system automatically calculates the next expected due date for each recurring invoice:

- **Monthly**: Adds 1 month to last invoice date
- **Bi-Monthly**: Adds 2 months to last invoice date
- **Quarterly**: Adds 3 months to last invoice date
- **Annual**: Adds 1 year to last invoice date

The calculation continues adding intervals until it finds the next date in the future.

## Alternative Email Services

Instead of Resend, you can use:

### SendGrid

```typescript
// In edge function
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'))

await sgMail.send({
  to: to,
  from: 'noreply@yourdomain.com',
  subject: subject,
  html: html,
})
```

### Mailgun

```typescript
const formData = new FormData()
formData.append('from', 'noreply@yourdomain.com')
formData.append('to', to)
formData.append('subject', subject)
formData.append('html', html)

const response = await fetch(
  `https://api.mailgun.net/v3/${Deno.env.get('MAILGUN_DOMAIN')}/messages`,
  {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`api:${Deno.env.get('MAILGUN_API_KEY')}`)}`,
    },
    body: formData,
  }
)
```

## Troubleshooting

### Emails Not Sending

1. Check that `VITE_NOTIFICATION_EMAIL` is set in `.env.local`
2. Verify Supabase Edge Function is deployed: `supabase functions list`
3. Check Edge Function logs: `supabase functions logs send-email`
4. Verify Resend API key is set: `supabase secrets list`
5. Check browser console for errors

### Duplicate Emails

The system prevents duplicate emails by storing the last notification date in localStorage. If you're getting duplicates:

1. Clear localStorage: `localStorage.removeItem('lastNotificationDate')`
2. Refresh the page

### Wrong Due Dates

Verify the `lastInvoiceDate` values in `src/App.jsx` match your actual invoice data. Update the dates in the `RECURRING_INVOICES` object.

## Status Card Feature

The Dashboard now includes a **Status Card** that displays:

- Total unpaid invoices across all companies
- Total uncompleted tasks across all companies
- Breakdown by company
- **Upcoming due dates** with color-coded urgency:
  - 🔴 Red: Overdue
  - 🟠 Orange: Due within 7 days
  - ⚪ Gray: Due later

This provides a real-time overview without waiting for the scheduled email.

## Disabling Notifications

To disable automatic email notifications:

1. Remove or comment out the `VITE_NOTIFICATION_EMAIL` in `.env.local`
2. Or set it to an empty value

The Status Card will still show all information in the dashboard.

## Cost Considerations

### Resend (Recommended)
- **Free tier**: 3,000 emails/month, 100 emails/day
- With 2 emails per month (15th and 30th), you'll use **24 emails/year**
- **Cost**: FREE

### SendGrid
- **Free tier**: 100 emails/day
- **Cost**: FREE for this use case

### Mailgun
- **Free tier**: 5,000 emails/month for 3 months
- **Cost**: $35/month after trial

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use environment variables** for all sensitive data
3. **Enable RLS** (Row Level Security) on Supabase tables
4. **Restrict Edge Function access** if needed
5. **Verify recipient email** before sending

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs/guides/functions
- Resend Docs: https://resend.com/docs
- Open an issue in the project repository
