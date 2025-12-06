export default function InvoiceInput({
  nameValue,
  amountValue,
  onNameChange,
  onAmountChange,
  onAdd,
  darkMode,
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && nameValue.trim() && amountValue) {
      onAdd()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={nameValue}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Leverandør..."
        className={`flex-1 px-4 py-3 border-2 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-sm sm:text-base ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
        }`}
      />
      <input
        type="number"
        value={amountValue}
        onChange={(e) => onAmountChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Beløp"
        step="0.01"
        className={`flex-1 px-4 py-3 border-2 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-sm sm:text-base ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
        }`}
      />
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base whitespace-nowrap"
      >
        Legg til
      </button>
    </div>
  )
}
