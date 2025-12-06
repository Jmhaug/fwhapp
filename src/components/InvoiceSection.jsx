import { useState } from 'react'
import InvoiceInput from './InvoiceInput'
import InvoiceList from './InvoiceList'

export default function InvoiceSection({ data, onUpdate, darkMode }) {
  const [nameInput, setNameInput] = useState('')
  const [amountInput, setAmountInput] = useState('')

  const handleAddInvoice = () => {
    const name = nameInput.trim()
    const amount = parseFloat(amountInput)

    if (!name || !amount || amount <= 0) return

    const numericId = Date.now()
    const stringId = `adhoc-${name}-${amount}`

    onUpdate((prev) => ({
      ...prev,
      invoices: [
        ...prev.invoices,
        {
          id: stringId,
          numericId,
          name,
          amount,
          completed: false,
        },
      ],
    }))

    setNameInput('')
    setAmountInput('')
  }

  const handleDeleteInvoice = (id) => {
    onUpdate((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((inv) => inv.id !== id),
    }))
  }

  const handleToggleComplete = (id) => {
    onUpdate((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) =>
        inv.id === id ? { ...inv, completed: !inv.completed } : inv
      ),
    }))
  }

  const total = data.invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
    }).format(amount)

  return (
    <div className={`rounded-2xl shadow-lg p-6 sm:p-8 animate-slide-in ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
          💰
        </div>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fakturaer</h2>
          {data.invoices.length > 0 && (
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {data.invoices.length} faktura{data.invoices.length !== 1 ? 'er' : ''}
            </p>
          )}
        </div>
      </div>

      <InvoiceInput
        nameValue={nameInput}
        amountValue={amountInput}
        onNameChange={setNameInput}
        onAmountChange={setAmountInput}
        onAdd={handleAddInvoice}
        darkMode={darkMode}
      />

      {data.invoices.length > 0 && (
        <>
          <div className={`mb-6 p-4 rounded-lg border-l-4 border-emerald-500 ${
            darkMode
              ? 'bg-emerald-900 bg-opacity-20'
              : 'bg-gradient-to-r from-emerald-50 to-teal-50'
          }`}>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-emerald-300' : 'text-gray-600'}`}>Totalt</p>
            <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
              {formatCurrency(total)}
            </p>
          </div>
          <InvoiceList invoices={data.invoices} onDelete={handleDeleteInvoice} onToggleComplete={handleToggleComplete} darkMode={darkMode} />
        </>
      )}

      {data.invoices.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Ingen fakturaer ennå</p>
        </div>
      )}
    </div>
  )
}
