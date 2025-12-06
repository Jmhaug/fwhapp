export default function CompanyTabs({ companies, currentCompany, onCompanyChange, darkMode }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center animate-fade-in">
      {Object.entries(companies).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onCompanyChange(key)}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
            currentCompany === key
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : `${darkMode ? 'bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-700' : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'} hover:shadow-md hover:scale-102`
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
