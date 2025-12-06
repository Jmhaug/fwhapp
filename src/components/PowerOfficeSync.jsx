import { Cloud, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import powerofficeService from '../services/poweroffice'

export default function PowerOfficeSync({
  darkMode,
  onSyncComplete,
  companyMapping = {},
}) {
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [invoiceCount, setInvoiceCount] = useState(0)

  const isConfigured = powerofficeService.isConfigured()

  const handleSync = async () => {
    try {
      setError(null)
      setSuccess(false)
      setSyncing(true)

      const syncedInvoices = await powerofficeService.syncInvoices(companyMapping)

      const totalCount =
        syncedInvoices.bemanning.length +
        syncedInvoices.eiendom.length +
        syncedInvoices.invest.length

      setInvoiceCount(totalCount)
      setSuccess(true)

      if (onSyncComplete) {
        onSyncComplete(syncedInvoices)
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to sync PowerOffice invoices')
      console.error('PowerOffice sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  if (!isConfigured) {
    return (
      <div
        className={`p-4 rounded-lg border-2 border-yellow-500 ${
          darkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <AlertCircle
            className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
          />
          <div>
            <p
              className={`font-semibold ${
                darkMode ? 'text-yellow-300' : 'text-yellow-700'
              }`}
            >
              PowerOffice Not Configured
            </p>
            <p
              className={`text-sm ${
                darkMode ? 'text-yellow-200' : 'text-yellow-600'
              }`}
            >
              Add PowerOffice credentials to .env.local to enable sync
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-4 rounded-lg border ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="w-5 h-5 text-blue-500" />
          <div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sync from PowerOffice
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Import invoices directly from PowerOffice
            </p>
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            syncing
              ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
              : `${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {error && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`}
          />
          <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
            {error}
          </p>
        </div>
      )}

      {success && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
          }`}
        >
          <CheckCircle2
            className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`}
          />
          <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
            Successfully synced {invoiceCount} invoices from PowerOffice
          </p>
        </div>
      )}
    </div>
  )
}
