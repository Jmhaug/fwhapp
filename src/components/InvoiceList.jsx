import { CheckCircle2, Circle } from 'lucide-react'

export default function InvoiceList({ invoices, onDelete, onToggleComplete, darkMode }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  return (
    <div className="space-y-2">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          {/* Checkbox for completion */}
          <button
            onClick={() => onToggleComplete && onToggleComplete(invoice.id)}
            className="flex-shrink-0"
          >
            {invoice.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            )}
          </button>

          {/* Invoice details */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm sm:text-base truncate ${
              invoice.completed
                ? `${darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'}`
                : `${darkMode ? 'text-white' : 'text-gray-900'}`
            }`}>
              {invoice.name}
            </p>
            <p className={`font-bold text-sm sm:text-base ${
              invoice.completed
                ? `${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                : `${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`
            }`}>
              {formatCurrency(invoice.amount)}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(invoice.id)}
            className={`p-2 text-red-500 rounded-lg transition-colors flex-shrink-0 ${
              darkMode ? 'hover:bg-gray-600' : 'hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
