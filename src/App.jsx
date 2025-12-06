import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { scheduleNotificationCheck } from './services/emailNotification'
import CompanyTabs from './components/CompanyTabs'
import TaskSection from './components/TaskSection'
import InvoiceSection from './components/InvoiceSection'
import RecurringInvoices from './components/RecurringInvoices'
import PowerOfficeSync from './components/PowerOfficeSync'
import FinancialDashboard from './components/FinancialDashboard'
import Landing from './components/Landing'

const COMPANIES = {
  bemanning: 'FWH Bemanning',
  eiendom: 'FWH Eiendom',
  invest: 'FWH Invest',
}

// Recurring invoices extracted from CSV analysis - CORRECTLY ASSIGNED TO COMPANIES
const RECURRING_INVOICES = {
  eiendom: [
    { id: 1, name: 'Sameiet Fanatorget', amount: 6829.67, frequency: 'Bi-Monthly', invoiceCount: 6, lastInvoiceDate: '2025-10-15' },
    { id: 2, name: 'Accountor AS', amount: 3528.36, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-29' },
    { id: 3, name: 'Bergen kommune', amount: 2555.64, frequency: 'Bi-Monthly', invoiceCount: 5, lastInvoiceDate: '2025-11-01' },
    { id: 4, name: 'PowerOffice AS', amount: 542.05, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-30' },
  ],
  invest: [
    { id: 5, name: 'Accountor AS', amount: 3442.0, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-29' },
    { id: 6, name: 'PowerOffice AS', amount: 504.2, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-30' },
  ],
  bemanning: [
    { id: 7, name: 'Skatteetaten', amount: 52170.0, frequency: 'Quarterly', invoiceCount: 3, lastInvoiceDate: '2025-09-26' },
    { id: 8, name: 'Fwh Eiendom AS', amount: 15680.0, frequency: 'Bi-Monthly', invoiceCount: 5, lastInvoiceDate: '2025-10-01' },
    { id: 9, name: 'Accountor AS', amount: 6388.09, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-29' },
    { id: 10, name: 'Nordea Liv AS', amount: 2857.67, frequency: 'Monthly', invoiceCount: 12, lastInvoiceDate: '2025-12-01' },
    { id: 11, name: 'If Skadeforsikring NUF', amount: 2419.6, frequency: 'Bi-Monthly', invoiceCount: 5, lastInvoiceDate: '2025-11-16' },
    { id: 12, name: 'PowerOffice AS', amount: 989.77, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-30' },
    { id: 13, name: 'Talkmore AS', amount: 646.01, frequency: 'Monthly', invoiceCount: 12, lastInvoiceDate: '2025-12-01' },
    { id: 14, name: 'BKK AS', amount: 291.05, frequency: 'Monthly', invoiceCount: 12, lastInvoiceDate: '2025-12-03' },
    { id: 15, name: 'Kraftriket AS', amount: 130.42, frequency: 'Monthly', invoiceCount: 11, lastInvoiceDate: '2025-11-30' },
  ],
}

export default function App() {
  const [currentCompany, setCurrentCompany] = useState('bemanning')
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true'
    }
    return false
  })
  const [activeTab, setActiveTab] = useState('landing')
  const [data, setData] = useState({
    bemanning: { tasks: [], invoices: [], recurringPaid: [] },
    eiendom: { tasks: [], invoices: [], recurringPaid: [] },
    invest: { tasks: [], invoices: [], recurringPaid: [] },
  })
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  // Get current month name
  const currentMonth = new Date().toLocaleString('no-NO', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + new Date().toLocaleString('no-NO', { month: 'long', year: 'numeric' }).slice(1)

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Load data from localStorage and Supabase
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('fwhData')
      if (saved) {
        setData(JSON.parse(saved))
      }

      // If Supabase is configured, try to load from there
      if (isSupabaseConfigured()) {
        try {
          const { data: supabaseData, error } = await supabase
            .from('fwh_data')
            .select('*')
            .single()

          if (!error && supabaseData) {
            const parsedData = JSON.parse(supabaseData.data_json)
            setData(parsedData)
            setLastSync(new Date(supabaseData.updated_at))
          }
        } catch (err) {
          console.log('Supabase load info:', err.message)
        }
      }
    }

    loadData()
  }, [])

  // Save data to localStorage and Supabase
  useEffect(() => {
    const saveData = async () => {
      // Save to localStorage
      localStorage.setItem('fwhData', JSON.stringify(data))

      // If Supabase is configured, sync to cloud
      if (isSupabaseConfigured()) {
        try {
          setSyncing(true)
          const { error: upsertError } = await supabase
            .from('fwh_data')
            .upsert(
              {
                id: 'fwh_main',
                data_json: JSON.stringify(data),
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            )

          if (!upsertError) {
            setLastSync(new Date())
          }
        } catch (err) {
          console.log('Supabase sync info:', err.message)
        } finally {
          setSyncing(false)
        }
      }
    }

    const debounceTimer = setTimeout(saveData, 500)
    return () => clearTimeout(debounceTimer)
  }, [data])

  // Schedule email notifications (15th and 30th of each month)
  useEffect(() => {
    const recipientEmail = import.meta.env.VITE_NOTIFICATION_EMAIL

    // Only schedule if email is configured and valid
    if (recipientEmail &&
        recipientEmail !== 'your_email@example.com' &&
        recipientEmail.includes('@') &&
        Object.keys(data).length > 0) {

      console.log('Email notifications enabled for:', recipientEmail)
      scheduleNotificationCheck(data, RECURRING_INVOICES, recipientEmail)
    }
  }, [data])

  const updateCompanyData = (updater) => {
    setData((prev) => {
      const updatedCompanyData = updater(prev[currentCompany])

      // Auto-sync ad-hoc invoices with recurringPaid
      const syncedData = { ...updatedCompanyData }
      if (syncedData.invoices && syncedData.invoices.length > 0) {
        syncedData.invoices.forEach((inv) => {
          if (inv.id && typeof inv.id === 'string' && inv.id.startsWith('adhoc-')) {
            if (inv.completed && !syncedData.recurringPaid.includes(inv.id)) {
              syncedData.recurringPaid = [...syncedData.recurringPaid, inv.id]
            } else if (!inv.completed && syncedData.recurringPaid.includes(inv.id)) {
              syncedData.recurringPaid = syncedData.recurringPaid.filter((id) => id !== inv.id)
            }
          }
        })
      }

      return {
        ...prev,
        [currentCompany]: syncedData,
      }
    })
  }

  const toggleRecurringInvoicePaid = (id) => {
    updateCompanyData((prev) => {
      // Toggle in recurringPaid
      const updatedRecurringPaid = prev.recurringPaid.includes(id)
        ? prev.recurringPaid.filter((pId) => pId !== id)
        : [...prev.recurringPaid, id]

      // Check if this is an ad-hoc invoice (starts with "adhoc-")
      const isAdHoc = typeof id === 'string' && id.startsWith('adhoc-')

      let updatedInvoices = prev.invoices

      if (isAdHoc) {
        // Find and toggle the completed status of the corresponding invoice
        updatedInvoices = prev.invoices.map((inv) => {
          const adhocId = `adhoc-${inv.name}-${inv.amount}`
          if (adhocId === id) {
            return { ...inv, completed: !inv.completed }
          }
          return inv
        })
      }

      return {
        ...prev,
        recurringPaid: updatedRecurringPaid,
        invoices: updatedInvoices,
      }
    })
  }

  const handlePowerOfficeSyncComplete = (syncedInvoices) => {
    // Merge synced invoices with existing data for all companies
    setData((prev) => ({
      bemanning: {
        ...prev.bemanning,
        invoices: [
          ...prev.bemanning.invoices,
          ...(syncedInvoices.bemanning || []),
        ],
      },
      eiendom: {
        ...prev.eiendom,
        invoices: [
          ...prev.eiendom.invoices,
          ...(syncedInvoices.eiendom || []),
        ],
      },
      invest: {
        ...prev.invest,
        invoices: [
          ...prev.invest.invoices,
          ...(syncedInvoices.invest || []),
        ],
      },
    }))
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
                FWH Sjekkliste
              </h1>
              <div className="flex items-center gap-3">
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Din arbeidsplattform</p>
                <span className={`text-xs sm:text-sm px-3 py-1 rounded-full ${
                  darkMode
                    ? 'bg-indigo-900 text-indigo-300'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {currentMonth}
                </span>
                {isSupabaseConfigured() && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    syncing
                      ? darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                      : darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    {syncing ? '⚙️ Syncing...' : lastSync ? '☁️ Synced' : ''}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-lg transition-all ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-lg`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Company Tabs */}
          <CompanyTabs
            companies={COMPANIES}
            currentCompany={currentCompany}
            onCompanyChange={setCurrentCompany}
            darkMode={darkMode}
          />

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-8 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300`
              }`}
            >
              Landing
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300`
              }`}
            >
              Sjekkliste
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'recurring'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300`
              }`}
            >
              Gjentakende fakturaer
            </button>
            {currentCompany === 'bemanning' && (
              <button
                onClick={() => setActiveTab('finance')}
                className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'finance'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300`
                }`}
              >
                Økonomi
              </button>
            )}
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : `text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300`
              }`}
            >
              Økonomi
            </button>
          </div>

          {/* Main Content */}
          {activeTab === 'landing' && (
            <Landing
              data={data}
              companies={COMPANIES}
              recurringInvoices={RECURRING_INVOICES}
              darkMode={darkMode}
              currentMonthLabel={currentMonth}
            />
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-5">
              <PowerOfficeSync
                darkMode={darkMode}
                onSyncComplete={handlePowerOfficeSyncComplete}
              />
              <TaskSection
                data={data[currentCompany]}
                onUpdate={updateCompanyData}
                darkMode={darkMode}
                currentCompany={currentCompany}
                companies={COMPANIES}
              />
              <InvoiceSection
                data={data[currentCompany]}
                onUpdate={updateCompanyData}
                darkMode={darkMode}
              />
            </div>
          )}

          {activeTab === 'recurring' && (
            <RecurringInvoices
              invoices={RECURRING_INVOICES[currentCompany]}
              paidIds={data[currentCompany].recurringPaid}
              onTogglePaid={toggleRecurringInvoicePaid}
              darkMode={darkMode}
              company={COMPANIES[currentCompany]}
              adHocInvoices={data[currentCompany].invoices}
            />
          )}

          {activeTab === 'finance' && currentCompany === 'bemanning' && (
            <FinancialDashboard darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  )
}
