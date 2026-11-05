import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import Icon from '../components/Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function MyTask() {
  const tasks = useTodoStore(state => state.tasks)
  const myTasks = tasks.filter(task => task.groupId === null)

  return (
    <div className="page-content space-y-7">
      <div>
        <h1 className="page-title">My Task</h1>
        <p className="page-description">Add and manage your ungrouped tasks in one place.</p>
      </div>

      <section className="card" aria-labelledby="add-task-heading">
        <div className="section-heading">
          <span className="section-icon"><Icon name="plus" size={21} /></span>
          <div><h2 id="add-task-heading" className="section-title">Add a New Task</h2><p className="section-description">Start with one thing you want to get done.</p></div>
        </div>
        <TaskForm />
      </section>

      <section className="card" aria-labelledby="your-tasks-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5"><h2 id="your-tasks-heading" className="section-title">Your Tasks</h2><span className="count-badge">{myTasks.length}</span></div>
          <span className="text-xs text-slate-500">Ungrouped tasks</span>
        </div>
        <TaskList tasks={myTasks} />
      </section>
    </div>
  )
}

export default MyTask
