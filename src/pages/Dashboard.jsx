import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import Statistics from '../components/Statistics.jsx'

function Dashboard({ tasks, addTask, toggleTask, deleteTask }) {
  const dashboardTasks = tasks.filter(task => task.groupId === null)
  const instructions = [
    { title: 'Add a Task', text: 'Type a task, then click Add Task or press Enter.', color: 'border-blue-200 bg-blue-50', accent: 'text-blue-700' },
    { title: 'Complete a Task', text: 'Check Not Done to mark it Done. Uncheck to undo.', color: 'border-green-200 bg-green-50', accent: 'text-green-700' },
    { title: 'Delete a Task', text: 'Click Delete beside a task to remove it.', color: 'border-pink-200 bg-pink-50', accent: 'text-pink-700' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="page-title mb-0">To-Do List</h1>

      <section className="card" aria-labelledby="add-task-heading">
        <h2 id="add-task-heading" className="section-title">Add a New Task</h2>
        <TaskForm addTask={addTask} />
      </section>

      <section aria-labelledby="statistics-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="statistics-heading" className="text-base font-semibold text-blue-800">Task Statistics</h2>
          <span className="text-xs text-slate-500">Across all groups and dashboard</span>
        </div>
        <Statistics tasks={tasks} />
      </section>

      <section className="card" aria-labelledby="your-tasks-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="your-tasks-heading" className="text-base font-semibold text-blue-800">Your Tasks</h2>
          <span className="text-xs text-slate-500">Ungrouped tasks</span>
        </div>
        <TaskList tasks={dashboardTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      </section>

      <section aria-labelledby="how-to-use-heading">
        <h2 id="how-to-use-heading" className="section-title">How to Use</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {instructions.map((instruction, index) => (
            <article key={instruction.title} className={`card p-4 ${instruction.color}`}>
              <h3 className="mb-2 text-sm font-semibold"><span className={`mr-2 ${instruction.accent}`}>{index + 1}.</span>{instruction.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{instruction.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
