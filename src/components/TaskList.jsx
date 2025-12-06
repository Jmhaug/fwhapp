export default function TaskList({ tasks, onToggle, onDelete, darkMode }) {
  const formatDate = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleString('no-NO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCompanyColor = (company) => {
    const colors = {
      bemanning: { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'bg-blue-900', darkText: 'text-blue-300' },
      eiendom: { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'bg-emerald-900', darkText: 'text-emerald-300' },
      invest: { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'bg-purple-900', darkText: 'text-purple-300' },
    }
    return colors[company] || colors.bemanning
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const companyColor = getCompanyColor(task.company)
        return (
          <div
            key={task.id}
            className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-200 border-l-4 ${
              task.completed
                ? `${darkMode ? 'bg-gray-700 opacity-60 border-l-gray-600' : 'bg-gray-50 opacity-60 border-l-gray-300'}`
                : `${darkMode ? 'bg-gray-700 hover:bg-gray-600 border-l-indigo-500' : 'bg-gray-50 hover:bg-gray-100 border-l-indigo-600'}`
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="w-5 h-5 cursor-pointer accent-indigo-600 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`flex-1 text-sm sm:text-base transition-all ${
                    task.completed
                      ? `${darkMode ? 'text-gray-500 line-through' : 'text-gray-400 line-through'}`
                      : `${darkMode ? 'text-gray-200' : 'text-gray-900'}`
                  }`}
                >
                  {task.text}
                </span>
                {task.companyName && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      darkMode ? `${companyColor.darkBg} ${companyColor.darkText}` : `${companyColor.bg} ${companyColor.text}`
                    }`}
                  >
                    {task.companyName}
                  </span>
                )}
              </div>
              {task.createdAt && (
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {formatDate(task.createdAt)}
                </p>
              )}
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className={`p-2 text-red-500 rounded-lg transition-colors flex-shrink-0 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-red-50'}`}
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
        )
      })}
    </div>
  )
}
