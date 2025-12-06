import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Email notification service for sending checklist reminders
 * Sends notifications on the 15th and 30th of each month
 */

/**
 * Calculate the next due date for recurring invoices based on frequency
 */
export const calculateNextDueDate = (lastInvoiceDate, frequency) => {
  if (!lastInvoiceDate) return null

  const last = new Date(lastInvoiceDate)
  const today = new Date()
  let nextDate = new Date(last)

  switch (frequency) {
    case 'Monthly':
      // Add months until we get a future date
      while (nextDate <= today) {
        nextDate.setMonth(nextDate.getMonth() + 1)
      }
      break
    case 'Bi-Monthly':
      // Add 2 months
      while (nextDate <= today) {
        nextDate.setMonth(nextDate.getMonth() + 2)
      }
      break
    case 'Quarterly':
      // Add 3 months
      while (nextDate <= today) {
        nextDate.setMonth(nextDate.getMonth() + 3)
      }
      break
    case 'Annual':
      // Add 1 year
      while (nextDate <= today) {
        nextDate.setFullYear(nextDate.getFullYear() + 1)
      }
      break
    default:
      return null
  }

  return nextDate
}

/**
 * Get invoice statistics for all companies
 */
export const getInvoiceStats = (data, recurringInvoices) => {
  const stats = {
    bemanning: { unpaid: 0, total: 0, nextDueDates: [] },
    eiendom: { unpaid: 0, total: 0, nextDueDates: [] },
    invest: { unpaid: 0, total: 0, nextDueDates: [] },
  }

  Object.keys(recurringInvoices).forEach((company) => {
    const invoices = recurringInvoices[company]
    const paidIds = data[company]?.recurringPaid || []
    const adHocInvoices = data[company]?.invoices || []

    stats[company].total = invoices.length + adHocInvoices.length
    stats[company].unpaid = stats[company].total - paidIds.length

    // Calculate next due dates
    invoices.forEach((invoice) => {
      const nextDue = calculateNextDueDate(invoice.lastInvoiceDate, invoice.frequency)
      if (nextDue) {
        stats[company].nextDueDates.push({
          name: invoice.name,
          date: nextDue,
          amount: invoice.amount,
          isPaid: paidIds.includes(invoice.id),
        })
      }
    })

    // Sort by date
    stats[company].nextDueDates.sort((a, b) => a.date - b.date)
  })

  return stats
}

/**
 * Get task statistics for all companies
 */
export const getTaskStats = (data) => {
  const stats = {
    bemanning: { uncompleted: 0, total: 0 },
    eiendom: { uncompleted: 0, total: 0 },
    invest: { uncompleted: 0, total: 0 },
  }

  Object.keys(data).forEach((company) => {
    const tasks = data[company]?.tasks || []
    stats[company].total = tasks.length
    stats[company].uncompleted = tasks.filter((t) => !t.completed).length
  })

  return stats
}

/**
 * Check if today is a notification day (15th or 30th)
 */
export const isNotificationDay = () => {
  const today = new Date()
  const day = today.getDate()
  return day === 15 || day === 30
}

/**
 * Get the last time a notification was sent
 */
export const getLastNotificationDate = () => {
  const lastNotif = localStorage.getItem('lastNotificationDate')
  return lastNotif ? new Date(lastNotif) : null
}

/**
 * Set the last notification date
 */
export const setLastNotificationDate = (date = new Date()) => {
  localStorage.setItem('lastNotificationDate', date.toISOString())
}

/**
 * Check if notification should be sent today
 */
export const shouldSendNotification = () => {
  if (!isNotificationDay()) return false

  const lastNotif = getLastNotificationDate()
  if (!lastNotif) return true

  const today = new Date()
  // Check if we already sent today
  return (
    lastNotif.getDate() !== today.getDate() ||
    lastNotif.getMonth() !== today.getMonth() ||
    lastNotif.getFullYear() !== today.getFullYear()
  )
}

/**
 * Generate email content
 */
export const generateEmailContent = (invoiceStats, taskStats) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const today = new Date().toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .company-section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .company-title { color: #667eea; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .stat { display: inline-block; margin-right: 20px; }
        .stat-label { color: #666; font-size: 14px; }
        .stat-value { color: #333; font-size: 24px; font-weight: bold; }
        .warning { color: #e74c3c; font-weight: bold; }
        .success { color: #27ae60; font-weight: bold; }
        .invoice-list { margin-top: 15px; }
        .invoice-item { padding: 10px; background: #f0f0f0; margin-bottom: 8px; border-radius: 5px; }
        .invoice-name { font-weight: bold; }
        .invoice-date { color: #666; font-size: 14px; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FWH Sjekkliste - Statusrapport</h1>
          <p>Automatisk påminnelse - ${today}</p>
        </div>
        <div class="content">
  `

  // Add stats for each company
  const companies = {
    bemanning: 'FWH Bemanning',
    eiendom: 'FWH Eiendom',
    invest: 'FWH Invest',
  }

  Object.keys(companies).forEach((key) => {
    const companyName = companies[key]
    const invoices = invoiceStats[key]
    const tasks = taskStats[key]

    html += `
      <div class="company-section">
        <div class="company-title">${companyName}</div>

        <div style="margin-bottom: 20px;">
          <div class="stat">
            <div class="stat-label">Ubetalte fakturaer</div>
            <div class="stat-value ${invoices.unpaid > 0 ? 'warning' : 'success'}">${invoices.unpaid}/${invoices.total}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Ufulførte oppgaver</div>
            <div class="stat-value ${tasks.uncompleted > 0 ? 'warning' : 'success'}">${tasks.uncompleted}/${tasks.total}</div>
          </div>
        </div>
    `

    // Add upcoming invoices
    if (invoices.nextDueDates.length > 0) {
      html += `
        <div class="invoice-list">
          <h3>Kommende fakturaer:</h3>
      `

      // Show next 5 upcoming invoices
      invoices.nextDueDates.slice(0, 5).forEach((invoice) => {
        const isPaid = invoice.isPaid ? ' ✓' : ''
        const statusClass = invoice.isPaid ? 'success' : 'warning'
        html += `
          <div class="invoice-item">
            <div class="invoice-name ${statusClass}">${invoice.name}${isPaid}</div>
            <div class="invoice-date">Forfall: ${formatDate(invoice.date)} - ${formatCurrency(invoice.amount)}</div>
          </div>
        `
      })

      html += `</div>`
    }

    html += `</div>`
  })

  html += `
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
            <p style="margin-bottom: 15px;">Logg inn for å oppdatere sjekklisten din</p>
            <a href="${window.location.origin}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Åpne FWH Sjekkliste</a>
          </div>

          <div class="footer">
            <p>Denne e-posten ble automatisk sendt fra FWH Sjekkliste systemet.</p>
            <p>Du mottar denne fordi du har aktivert automatiske påminnelser på den 15. og 30. i hver måned.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return html
}

/**
 * Send email notification via Supabase Edge Function
 * Note: This requires setting up a Supabase Edge Function to handle email sending
 */
export const sendEmailNotification = async (data, recurringInvoices, recipientEmail) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Email notifications are disabled.')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const invoiceStats = getInvoiceStats(data, recurringInvoices)
    const taskStats = getTaskStats(data)
    const emailContent = generateEmailContent(invoiceStats, taskStats)

    // Call Supabase Edge Function to send email
    const { data: result, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: recipientEmail,
        subject: `FWH Sjekkliste - Statusrapport ${new Date().toLocaleDateString('no-NO')}`,
        html: emailContent,
      },
    })

    if (error) {
      throw error
    }

    // Mark notification as sent
    setLastNotificationDate()

    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email notification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Schedule email notification check
 * This should be called on app startup
 */
export const scheduleNotificationCheck = (data, recurringInvoices, recipientEmail) => {
  // Check immediately on app load
  if (shouldSendNotification()) {
    sendEmailNotification(data, recurringInvoices, recipientEmail)
  }

  // Check every hour
  setInterval(() => {
    if (shouldSendNotification()) {
      sendEmailNotification(data, recurringInvoices, recipientEmail)
    }
  }, 60 * 60 * 1000) // Check every hour
}
