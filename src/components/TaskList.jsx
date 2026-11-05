import Icon from './Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function TaskList({ tasks }) {
  const toggleTask = useTodoStore(state => state.toggleTask)
  const deleteTask = useTodoStore(state => state.deleteTask)
  if (tasks.length === 0) {
    return <div className="empty-state">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-400 shadow-sm"><Icon name="list" size={27} /></span>
      <p className="text-sm font-semibold text-slate-700">No tasks yet</p>
      <p className="mt-1.5 text-sm text-slate-500">Add a task above to get started.</p>
    </div>
  }

  return (
    <ul className="space-y-3" aria-label="Tasks">
      {tasks.map(task => (
        <li key={task.id} className={`task-row ${task.completed ? 'border-green-200 bg-green-50/70' : 'border-amber-200/80 bg-amber-50/70'}`}>
          <p className={`min-w-0 flex-1 break-words text-sm leading-relaxed [overflow-wrap:anywhere] ${task.completed ? 'text-green-700 line-through decoration-green-400' : 'text-slate-800'}`}>{task.title}</p>
          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
            <button type="button" onClick={() => toggleTask(task.id)} aria-label={`Mark ${task.title} as ${task.completed ? 'Not Done' : 'Done'}`} title={`Mark as ${task.completed ? 'Not Done' : 'Done'}`} className={`task-status ${task.completed ? 'border-green-200 bg-green-100 text-green-700 hover:bg-green-200' : 'border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
              <Icon name={task.completed ? 'checkCircle' : 'circle'} size={16} />{task.completed ? 'Done' : 'Not Done'}
            </button>
            <button type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} className="button-danger"><Icon name="trash" size={15} />Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
