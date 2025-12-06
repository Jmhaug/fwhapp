import { CheckCircle2, Circle } from 'lucide-react'

export default function RecurringInvoices({ invoices, paidIds, onTogglePaid, darkMode, company, adHocInvoices = [] }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  const formatCompact = (amount) => {
    if (amount >= 1000000) {
      return `~${(amount / 1000000).toFixed(0)}M`
    } else if (amount >= 1000) {
      return `~${(amount / 1000).toFixed(0)}k`
    }
    return `~${amount.toFixed(0)}`
  }

  const getFrequencyLabel = (frequency) => {
    const labels = {
      'Monthly': 'Månedlig',
      'Bi-Monthly': 'Bi-månedsvis',
      'Quarterly': 'Kvartalsvis',
      'Annual': 'Årlig',
      'Other': 'Øvrig',
    }
    return labels[frequency] || frequency
  }

  const totalMonthly = invoices
    .filter((inv) => inv.frequency === 'Monthly')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalQuarterly = invoices
    .filter((inv) => inv.frequency === 'Quarterly')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const paidCount = paidIds.length
  const totalCount = invoices.length + adHocInvoices.length

  // Get current month name
  const currentMonth = new Date()
    .toLocaleString('no-NO', { month: 'long', year: 'numeric' })
    .charAt(0)
    .toUpperCase() +
    new Date()
      .toLocaleString('no-NO', { month: 'long', year: 'numeric' })
      .slice(1)

  // Combine recurring and ad-hoc invoices
  const allInvoices = [
    ...invoices,
    ...adHocInvoices.map((inv) => ({
      ...inv,
      frequency: 'Other',
    })),
  ]

  return (
    <div className={`rounded-2xl shadow-lg p-6 sm:p-8 animate-slide-in ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mb-8">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Gjentakende fakturaer - {company}
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Betalt denne måneden</p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {paidCount}/{totalCount}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-emerald-50'}`}>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>Månedlig</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
              {formatCompact(totalMonthly)} NOK
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Kvartalsvis</p>
            <p className={`text-lg font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              {formatCompact(totalQuarterly)} NOK
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentMonth}
          </p>
          <div className="flex justify-between items-center mb-2">
            <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progresjon</p>
            <p className={`text-sm font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0}%
            </p>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(paidCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Invoice List - Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allInvoices.map((invoice) => {
          const isPaid = paidIds.includes(invoice.id)
          return (
            <button
              key={invoice.id}
              onClick={() => onTogglePaid(invoice.id)}
              className={`flex flex-col gap-3 p-4 rounded-lg transition-all text-left h-full ${
                isPaid
                  ? `${darkMode ? 'bg-gray-700 opacity-60' : 'bg-gray-50 opacity-60'}`
                  : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold text-sm ${
                      isPaid
                        ? `${darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'}`
                        : `${darkMode ? 'text-white' : 'text-gray-900'}`
                    }`}>
                      {invoice.name}
                    </p>
                    {invoice.id && typeof invoice.id === 'string' && invoice.id.startsWith('adhoc-') && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        Ny
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getFrequencyLabel(invoice.frequency)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {isPaid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
                  )}
                </div>
              </div>

              <div className={`pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <p className={`font-bold text-sm ${
                  isPaid
                    ? `${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                    : `${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`
                }`}>
                  {formatCompact(invoice.amount)} NOK
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
