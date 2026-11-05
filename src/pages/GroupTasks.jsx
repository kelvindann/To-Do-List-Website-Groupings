import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Statistics from '../components/Statistics.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import Icon from '../components/Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function GroupTasks() {
  const groups = useTodoStore(state => state.groups)
  const tasks = useTodoStore(state => state.tasks)
  const clearGroupTasks = useTodoStore(state => state.clearGroupTasks)
  const { groupId } = useParams()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const group = groups.find(item => item.id === groupId)
  const groupTasks = tasks.filter(task => task.groupId === groupId)

  if (!group) {
    return <section className="card"><h1 className="page-title">Group not found</h1><p className="my-4 text-sm text-slate-600">This group does not exist or has been deleted.</p><Link to="/groups" className="back-link"><Icon name="back" size={16} />Back to Task Groups</Link></section>
  }

  return (
    <div className="page-content space-y-7">
      <div>
        <Link to="/groups" className="back-link"><Icon name="back" size={16} />Back to Task Groups</Link>
        <h1 className="page-title mt-4 break-words [overflow-wrap:anywhere]">{group.name}</h1>
        <p className="page-description">Add tasks to this group and manage them in one place.</p>
      </div>

      <section className="card" aria-labelledby="group-add-task-heading">
        <div className="section-heading"><span className="section-icon"><Icon name="plus" size={21} /></span><div><h2 id="group-add-task-heading" className="section-title">Add a New Task</h2><p className="section-description">Your task will be added to this group.</p></div></div>
        <TaskForm key={group.id} groupId={group.id} />
      </section>

      <section aria-labelledby="group-statistics-heading">
        <h2 id="group-statistics-heading" className="section-title mb-4">Task Statistics</h2>
        <Statistics tasks={groupTasks} />
      </section>

      <section className="card" aria-labelledby="group-tasks-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5"><h2 id="group-tasks-heading" className="section-title">Group Tasks</h2><span className="count-badge">{groupTasks.length}</span></div>
          <button type="button" disabled={groupTasks.length === 0} onClick={() => setShowConfirmation(true)} className="button-danger"><Icon name="trash" size={15} />Clear All Tasks</button>
        </div>
        <TaskList tasks={groupTasks} />
      </section>

      {showConfirmation && <ConfirmDialog title="Clear all tasks?" message={`${groupTasks.length === 1 ? 'Delete the task' : `Delete all ${groupTasks.length} tasks`} in "${group.name}"? This cannot be undone.`} confirmLabel="Clear All Tasks" onCancel={() => setShowConfirmation(false)} onConfirm={() => { clearGroupTasks(group.id); setShowConfirmation(false) }} />}
    </div>
  )
}

export default GroupTasks
