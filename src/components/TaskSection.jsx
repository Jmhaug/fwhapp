import { useState } from 'react'
import TaskInput from './TaskInput'
import TaskList from './TaskList'

export default function TaskSection({ data, onUpdate, darkMode, currentCompany, companies }) {
  const [inputValue, setInputValue] = useState('')

  const formatDate = (date) => {
    return new Date(date).toLocaleString('no-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleAddTask = (text) => {
    if (!text.trim()) return

    onUpdate((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          id: Date.now(),
          text: text.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          company: currentCompany,
          companyName: companies?.[currentCompany] || currentCompany,
        },
      ],
    }))
    setInputValue('')
  }

  const handleToggleTask = (id) => {
    onUpdate((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }))
  }

  const handleDeleteTask = (id) => {
    onUpdate((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
    }))
  }

  const completedCount = data.tasks.filter((t) => t.completed).length

  return (
    <div className={`rounded-2xl shadow-lg p-6 sm:p-8 animate-slide-in ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
          ✓
        </div>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Oppgaver</h2>
          {data.tasks.length > 0 && (
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {completedCount} av {data.tasks.length} fullført
            </p>
          )}
        </div>
      </div>

      <TaskInput
        value={inputValue}
        onChange={setInputValue}
        onAdd={() => handleAddTask(inputValue)}
        darkMode={darkMode}
      />

      {data.tasks.length > 0 && (
        <>
          {completedCount > 0 && (
            <div className={`mb-4 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full overflow-hidden`}>
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(completedCount / data.tasks.length) * 100}%` }}
              />
            </div>
          )}
          <TaskList
            tasks={data.tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            darkMode={darkMode}
          />
        </>
      )}

      {data.tasks.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Ingen oppgaver ennå</p>
        </div>
      )}
    </div>
  )
}
