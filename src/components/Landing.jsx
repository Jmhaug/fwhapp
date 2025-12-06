import { CheckCircle2, Sparkles } from 'lucide-react'

const companyOrder = ['bemanning', 'eiendom', 'invest']

export default function Landing({ data, companies, recurringInvoices, darkMode, currentMonthLabel }) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const getStats = (key) => {
    const companyData = data[key] || {}
    const tasks = companyData.tasks || []
    const paidRecurring = companyData.recurringPaid || []
    const recurring = recurringInvoices?.[key] || []
    const adHocInvoices = companyData.invoices || []

    const completed = paidRecurring.length
    const total = recurring.length + adHocInvoices.length

    const extraThisMonth = tasks.filter((task) => {
      if (!task.createdAt) return false
      const created = new Date(task.createdAt)
      if (Number.isNaN(created)) return false
      return created >= startOfMonth
    }).length

    return { completed, total, extraThisMonth }
  }

  const cardBase = 'rounded-xl p-4 sm:p-5 shadow-lg border border-white/10 backdrop-blur'

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className={`text-sm ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>Statusoversikt</p>
          <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Kjapp status per selskap
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentMonthLabel} • Betalte gjentakende fakturaer + nye sjekklisteoppgaver
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {companyOrder.map((key) => {
          const { completed, total, extraThisMonth } = getStats(key)
          const name = companies[key]
          const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100)

          return (
            <div
              key={key}
              className={`rounded-2xl p-5 sm:p-6 shadow-xl ${
                darkMode
                  ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800'
                  : 'bg-gradient-to-br from-indigo-50 via-sky-50 to-blue-50'
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {name}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status for {currentMonthLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div
                  className={`${cardBase} ${
                    darkMode
                      ? 'bg-gradient-to-br from-indigo-700/50 to-purple-700/50'
                      : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white shadow-md">
                        <CheckCircle2 size={22} />
                      </span>
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                          Betalt
                        </p>
                        <p className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {completed}/{total || 0} fakturaer
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                      {completionPct}%
                    </span>
                  </div>
                  <div className={`mt-4 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`${cardBase} ${
                    darkMode
                      ? 'bg-gradient-to-br from-cyan-700/50 to-blue-700/50'
                      : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500 text-white shadow-md">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <p className={`text-xs uppercase tracking-wide ${darkMode ? 'text-cyan-100' : 'text-cyan-700'}`}>
                        Ekstra oppgaver
                      </p>
                      <p className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {extraThisMonth} lagt til denne måneden
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
