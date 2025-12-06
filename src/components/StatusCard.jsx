import { Bell, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { getInvoiceStats, getTaskStats, calculateNextDueDate } from '../services/emailNotification'

export default function StatusCard({ data, recurringInvoices, darkMode }) {
  const invoiceStats = getInvoiceStats(data, recurringInvoices)
  const taskStats = getTaskStats(data)

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  const formatDate = (date) => {
    if (!date) return 'Ikke satt'
    return new Date(date).toLocaleDateString('no-NO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Calculate total unpaid invoices and uncompleted tasks
  const totalUnpaidInvoices = Object.values(invoiceStats).reduce(
    (sum, stat) => sum + stat.unpaid,
    0
  )
  const totalInvoices = Object.values(invoiceStats).reduce(
    (sum, stat) => sum + stat.total,
    0
  )
  const totalUncompletedTasks = Object.values(taskStats).reduce(
    (sum, stat) => sum + stat.uncompleted,
    0
  )
  const totalTasks = Object.values(taskStats).reduce((sum, stat) => sum + stat.total, 0)

  // Get all upcoming due dates across all companies
  const allUpcomingDueDates = []
  Object.keys(invoiceStats).forEach((company) => {
    invoiceStats[company].nextDueDates.forEach((invoice) => {
      if (!invoice.isPaid) {
        allUpcomingDueDates.push({
          ...invoice,
          company,
        })
      }
    })
  })
  allUpcomingDueDates.sort((a, b) => a.date - b.date)

  const companyNames = {
    bemanning: 'FWH Bemanning',
    eiendom: 'FWH Eiendom',
    invest: 'FWH Invest',
  }

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 sm:p-8 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } animate-slide-in`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell
          className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
        />
        <h2
          className={`text-2xl sm:text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Statusoversikt
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Unpaid Invoices Summary */}
        <div
          className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-red-50 to-orange-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <AlertCircle
              className={`w-8 h-8 ${
                totalUnpaidInvoices > 0
                  ? 'text-red-500'
                  : darkMode
                  ? 'text-green-400'
                  : 'text-green-600'
              }`}
            />
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                totalUnpaidInvoices > 0
                  ? darkMode
                    ? 'bg-red-900 text-red-300'
                    : 'bg-red-100 text-red-700'
                  : darkMode
                  ? 'bg-green-900 text-green-300'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {totalUnpaidInvoices > 0 ? 'Krever handling' : 'Oppdatert'}
            </span>
          </div>
          <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ubetalte fakturaer
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalUnpaidInvoices}
            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              /{totalInvoices}
            </span>
          </div>
        </div>

        {/* Uncompleted Tasks Summary */}
        <div
          className={`p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <CheckCircle
              className={`w-8 h-8 ${
                totalUncompletedTasks > 0
                  ? 'text-orange-500'
                  : darkMode
                  ? 'text-green-400'
                  : 'text-green-600'
              }`}
            />
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                totalUncompletedTasks > 0
                  ? darkMode
                    ? 'bg-orange-900 text-orange-300'
                    : 'bg-orange-100 text-orange-700'
                  : darkMode
                  ? 'bg-green-900 text-green-300'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {totalUncompletedTasks > 0 ? 'Ventende' : 'Fullført'}
            </span>
          </div>
          <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ufulførte oppgaver
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalUncompletedTasks}
            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              /{totalTasks}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown by Company */}
      <div className="mb-8">
        <h3
          className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Per selskap
        </h3>
        <div className="space-y-3">
          {Object.keys(invoiceStats).map((company) => {
            const invoices = invoiceStats[company]
            const tasks = taskStats[company]
            const companyName = companyNames[company]

            return (
              <div
                key={company}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {companyName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span
                      className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Fakturaer:{' '}
                    </span>
                    <span
                      className={`font-semibold ${
                        invoices.unpaid > 0
                          ? 'text-red-500'
                          : darkMode
                          ? 'text-green-400'
                          : 'text-green-600'
                      }`}
                    >
                      {invoices.unpaid}/{invoices.total}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Oppgaver:{' '}
                    </span>
                    <span
                      className={`font-semibold ${
                        tasks.uncompleted > 0
                          ? 'text-orange-500'
                          : darkMode
                          ? 'text-green-400'
                          : 'text-green-600'
                      }`}
                    >
                      {tasks.uncompleted}/{tasks.total}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Due Dates */}
      {allUpcomingDueDates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar
              className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
            />
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Kommende forfallsdatoer
            </h3>
          </div>
          <div className="space-y-2">
            {allUpcomingDueDates.slice(0, 8).map((invoice, index) => {
              const daysUntil = Math.ceil(
                (invoice.date - new Date()) / (1000 * 60 * 60 * 24)
              )
              const isUrgent = daysUntil <= 7
              const isOverdue = daysUntil < 0

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    isOverdue
                      ? darkMode
                        ? 'bg-red-900 bg-opacity-30'
                        : 'bg-red-50'
                      : isUrgent
                      ? darkMode
                        ? 'bg-orange-900 bg-opacity-30'
                        : 'bg-orange-50'
                      : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {invoice.name}
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {companyNames[invoice.company]} • {formatCurrency(invoice.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold ${
                        isOverdue
                          ? 'text-red-500'
                          : isUrgent
                          ? 'text-orange-500'
                          : darkMode
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {formatDate(invoice.date)}
                    </div>
                    <div
                      className={`text-xs ${
                        isOverdue
                          ? 'text-red-500'
                          : isUrgent
                          ? 'text-orange-500'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {isOverdue
                        ? `${Math.abs(daysUntil)} dager forsinket`
                        : `Om ${daysUntil} dager`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Email Reminder Info */}
      <div
        className={`mt-6 p-4 rounded-lg ${
          darkMode ? 'bg-indigo-900 bg-opacity-30' : 'bg-indigo-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <Bell
            className={`w-5 h-5 mt-0.5 ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}
          />
          <div>
            <div
              className={`text-sm font-semibold mb-1 ${
                darkMode ? 'text-indigo-300' : 'text-indigo-900'
              }`}
            >
              Automatiske påminnelser
            </div>
            <div
              className={`text-xs ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}
            >
              Du vil motta e-post påminnelser den 15. og 30. i hver måned med
              statusoppdateringer for ubetalte fakturaer og ufulførte oppgaver.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
