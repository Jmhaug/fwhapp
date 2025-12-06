/**
 * PowerOffice API Service
 * Handles authentication and invoice data fetching from PowerOffice
 */

class PowerOfficeService {
  constructor() {
    this.baseUrl = 'https://goapi.poweroffice.net'
    this.demoUrl = 'https://goapi.poweroffice.net/Demo'
    this.accessToken = null
    this.tokenExpiry = null
  }

  /**
   * Get configuration from environment variables
   */
  getConfig() {
    return {
      applicationKey: import.meta.env.VITE_POWEROFFICE_APP_KEY,
      clientKey: import.meta.env.VITE_POWEROFFICE_CLIENT_KEY,
      subscriptionKey: import.meta.env.VITE_POWEROFFICE_SUBSCRIPTION_KEY,
      useDemo: import.meta.env.VITE_POWEROFFICE_USE_DEMO === 'true',
    }
  }

  /**
   * Get access token from PowerOffice OAuth
   */
  async getAccessToken() {
    const config = this.getConfig()

    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    // Missing credentials
    if (!config.applicationKey || !config.clientKey || !config.subscriptionKey) {
      throw new Error(
        'PowerOffice credentials not configured. Add VITE_POWEROFFICE_* variables to .env.local'
      )
    }

    const tokenUrl = config.useDemo
      ? `${this.demoUrl}/OAuth/Token`
      : `${this.baseUrl}/OAuth/Token`

    try {
      // Create base64 encoded credentials
      const credentials = btoa(`${config.applicationKey}:${config.clientKey}`)

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Ocp-Apim-Subscription-Key': config.subscriptionKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `PowerOffice authentication failed: ${response.status} - ${errorText}`
        )
      }

      const data = await response.json()
      this.accessToken = data.access_token

      // Set expiry to 19 minutes (token valid for 20 minutes)
      this.tokenExpiry = Date.now() + 19 * 60 * 1000

      return this.accessToken
    } catch (error) {
      console.error('PowerOffice token request failed:', error)
      throw error
    }
  }

  /**
   * Fetch invoices from PowerOffice API
   */
  async getInvoices(clientId, filters = {}) {
    const token = await this.getAccessToken()
    const config = this.getConfig()

    const apiUrl = config.useDemo ? this.demoUrl : this.baseUrl
    const endpoint = `${apiUrl}/v2/Invoices`

    try {
      const queryParams = new URLSearchParams({
        clientId: clientId || config.clientKey,
        ...filters, // Additional filters: dateFrom, dateTo, status, etc.
      })

      const response = await fetch(`${endpoint}?${queryParams}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        },
      })

      if (!response.ok) {
        throw new Error(
          `PowerOffice API error: ${response.status} - ${response.statusText}`
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Failed to fetch invoices from PowerOffice:', error)
      throw error
    }
  }

  /**
   * Fetch a single invoice by ID
   */
  async getInvoice(invoiceId) {
    const token = await this.getAccessToken()
    const config = this.getConfig()

    const apiUrl = config.useDemo ? this.demoUrl : this.baseUrl
    const endpoint = `${apiUrl}/v2/Invoices/${invoiceId}`

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        },
      })

      if (!response.ok) {
        throw new Error(`PowerOffice API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch invoice from PowerOffice:', error)
      throw error
    }
  }

  /**
   * Sync invoices from PowerOffice and categorize by company
   * Maps PowerOffice vendor data to FWH company structure
   */
  async syncInvoices(companyMapping = {}) {
    try {
      const invoices = await this.getInvoices()

      // Map invoices to companies based on vendor/project mapping
      const mapped = {
        bemanning: [],
        eiendom: [],
        invest: [],
      }

      if (Array.isArray(invoices)) {
        invoices.forEach((invoice) => {
          const company = this.mapInvoiceToCompany(invoice, companyMapping)
          if (company && mapped[company]) {
            mapped[company].push({
              id: invoice.InvoiceNumber || invoice.Id,
              name: invoice.VendorName || invoice.InvoiceNumber,
              amount: parseFloat(invoice.TotalAmount || 0),
              date: invoice.InvoiceDate || new Date().toISOString(),
              powerofficeId: invoice.Id,
              synced: true,
            })
          }
        })
      }

      return mapped
    } catch (error) {
      console.error('PowerOffice sync failed:', error)
      throw error
    }
  }

  /**
   * Map invoice to company based on vendor/project
   * Can be customized with company mapping rules
   */
  mapInvoiceToCompany(invoice, companyMapping = {}) {
    const vendorName = invoice.VendorName?.toLowerCase() || ''
    const projectName = invoice.ProjectName?.toLowerCase() || ''

    // Check if vendor is in mapping
    if (companyMapping[vendorName]) {
      return companyMapping[vendorName]
    }

    // Default: try to infer from vendor name
    if (vendorName.includes('bemanning')) return 'bemanning'
    if (vendorName.includes('eiendom')) return 'eiendom'
    if (vendorName.includes('invest')) return 'invest'

    // Check project name
    if (projectName.includes('bemanning')) return 'bemanning'
    if (projectName.includes('eiendom')) return 'eiendom'
    if (projectName.includes('invest')) return 'invest'

    return null
  }

  /**
   * Check if PowerOffice is configured
   */
  isConfigured() {
    const config = this.getConfig()
    return !!(
      config.applicationKey &&
      config.clientKey &&
      config.subscriptionKey
    )
  }
}

// Export singleton instance
export const powerofficeService = new PowerOfficeService()

export default powerofficeService
