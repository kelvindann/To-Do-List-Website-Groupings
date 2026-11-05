import Icon from './Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function Statistics({ tasks: scopedTasks }) {
  const allTasks = useTodoStore(state => state.tasks)
  const tasks = scopedTasks ?? allTasks
  const completed = tasks.filter(task => task.completed).length
  const statistics = [
    { label: 'Total Tasks', value: tasks.length, description: 'All your tasks', icon: 'list', color: 'border-blue-200/70 bg-blue-50', accent: 'bg-blue-100 text-blue-600', text: 'text-blue-800' },
    { label: 'Remaining', value: tasks.length - completed, description: 'Pending tasks', icon: 'clock', color: 'border-purple-200/70 bg-purple-50', accent: 'bg-purple-100 text-purple-600', text: 'text-purple-800' },
    { label: 'Completed', value: completed, description: 'Tasks marked Done', icon: 'checkCircle', color: 'border-green-200/70 bg-green-50', accent: 'bg-green-100 text-green-600', text: 'text-green-800' },
  ]

  return (
    <dl className="grid grid-cols-3 gap-2 sm:gap-4" aria-live="polite" aria-atomic="true">
      {statistics.map(statistic => (
        <div key={statistic.label} className={`rounded-2xl border px-2.5 py-4 sm:px-5 sm:py-5 ${statistic.color}`}>
          <dt className={`flex items-center justify-between gap-2 text-xs font-semibold sm:text-sm ${statistic.text}`}>
            <span>{statistic.label}</span>
            <span className={`hidden size-9 shrink-0 items-center justify-center rounded-xl sm:flex ${statistic.accent}`}><Icon name={statistic.icon} size={19} /></span>
          </dt>
          <dd className="mt-3 sm:mt-2"><span className={`text-3xl font-bold tracking-tight tabular-nums sm:text-4xl ${statistic.text}`}>{statistic.value}</span><span className="mt-2 hidden text-xs text-slate-600 sm:block">{statistic.description}</span></dd>
        </div>
      ))}
    </dl>
  )
}

export default Statistics
