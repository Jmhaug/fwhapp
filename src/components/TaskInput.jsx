export default function TaskInput({ value, onChange, onAdd, darkMode }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd()
    }
  }

  return (
    <div className="flex gap-3 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Legg til oppgave..."
        className={`flex-1 px-4 py-3 border-2 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm sm:text-base ${
          darkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
        }`}
      />
      <button
        onClick={onAdd}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg active:scale-95 transition-all text-sm sm:text-base whitespace-nowrap"
      >
        Legg til
      </button>
    </div>
  )
}
