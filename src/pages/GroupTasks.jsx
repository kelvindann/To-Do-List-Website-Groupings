import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Statistics from '../components/Statistics.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'

function GroupTasks({ groups, tasks, addTask, toggleTask, deleteTask, clearGroupTasks }) {
  const { groupId } = useParams()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const group = groups.find(item => item.id === groupId)
  const groupTasks = tasks.filter(task => task.groupId === groupId)

  if (!group) {
    return (
      <section className="card">
        <h1 className="page-title">Group not found</h1>
        <p className="mb-4 text-sm text-slate-600">This group does not exist or has been deleted.</p>
        <Link to="/groups" className="text-sm font-medium text-blue-700 hover:underline">Back to Task Groups</Link>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/groups" className="text-sm font-medium text-blue-700 hover:underline">← Back to Task Groups</Link>
        <h1 className="page-title mb-0 mt-3 break-words [overflow-wrap:anywhere]">{group.name}</h1>
      </div>

      <section className="card" aria-labelledby="group-add-task-heading">
        <h2 id="group-add-task-heading" className="section-title">Add a New Task</h2>
        <TaskForm key={group.id} addTask={addTask} groupId={group.id} />
      </section>

      <section aria-labelledby="group-statistics-heading">
        <h2 id="group-statistics-heading" className="section-title">Task Statistics</h2>
        <Statistics tasks={groupTasks} />
      </section>

      <section className="card" aria-labelledby="group-tasks-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="group-tasks-heading" className="text-base font-semibold text-blue-800">Group Tasks</h2>
          <button type="button" disabled={groupTasks.length === 0} onClick={() => setShowConfirmation(true)} className="button-danger">Clear All Tasks</button>
        </div>
        <TaskList tasks={groupTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
      </section>

      {showConfirmation && (
        <ConfirmDialog
          title="Clear all tasks?"
          message={`Delete all ${groupTasks.length} ${groupTasks.length === 1 ? 'task' : 'tasks'} in "${group.name}"? This cannot be undone.`}
          confirmLabel="Clear All Tasks"
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            clearGroupTasks(group.id)
            setShowConfirmation(false)
          }}
        />
      )}
    </div>
  )
}

export default GroupTasks
