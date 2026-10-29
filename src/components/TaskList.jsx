function TaskList({ tasks, toggleTask, deleteTask }) {
  if (tasks.length === 0) {
    return <p className="rounded-md border border-dashed border-blue-200 bg-blue-50 px-4 py-8 text-center text-sm text-slate-600">No tasks yet. Add a task above.</p>
  }

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <li key={task.id} className={`flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between ${task.completed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
          <p className={`min-w-0 flex-1 break-words text-sm [overflow-wrap:anywhere] ${task.completed ? 'text-green-700 line-through' : 'text-slate-800'}`}>
            {task.title}
          </p>
          <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
            <label className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${task.completed ? 'border-green-200 bg-green-100 text-green-700' : 'border-amber-200 bg-amber-100 text-amber-800'}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark ${task.title} as ${task.completed ? 'Not Done' : 'Done'}`}
                className="h-4 w-4 cursor-pointer accent-green-700"
              />
              <span>{task.completed ? 'Done' : 'Not Done'}</span>
            </label>
            <button type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} className="button-danger px-3 py-1.5">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
