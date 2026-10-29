import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function Groups({ groups, tasks, addGroup, deleteGroup }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const submitted = useRef(false)
  const inputRef = useRef(null)
  const groupColors = [
    'border-blue-200 border-l-blue-500 bg-blue-50',
    'border-purple-200 border-l-purple-500 bg-purple-50',
    'border-green-200 border-l-green-500 bg-green-50',
    'border-orange-200 border-l-orange-400 bg-orange-50',
  ]

  function handleSubmit(event) {
    event.preventDefault()
    if (submitted.current) return
    const message = addGroup(name)
    setError(message)
    if (!message) {
      submitted.current = true
      setName('')
    }
    inputRef.current.focus()
  }

  const selectedTaskCount = selectedGroup ? tasks.filter(task => task.groupId === selectedGroup.id).length : 0

  return (
    <div className="space-y-6">
      <h1 className="page-title mb-0">Task Groups</h1>

      <section className="card" aria-labelledby="create-group-heading">
        <h2 id="create-group-heading" className="section-title">Create a New Group</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="group-name" className="mb-2 block text-sm font-medium">Group name</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputRef}
              id="group-name"
              type="text"
              value={name}
              onChange={event => {
                submitted.current = false
                setName(event.target.value)
                setError('')
              }}
              placeholder="Enter a group name"
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'group-error' : undefined}
              className="text-input min-w-0 flex-1"
            />
            <button type="submit" disabled={!name.trim()} className="button-primary">Create Group</button>
          </div>
          {error && <p id="group-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        </form>
      </section>

      <section aria-labelledby="your-groups-heading">
        <h2 id="your-groups-heading" className="section-title">Your Groups</h2>
        {groups.length === 0 ? (
          <p className="card bg-blue-50 py-8 text-center text-sm text-slate-600">No groups yet. Create a group above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group, index) => {
              const groupTasks = tasks.filter(task => task.groupId === group.id)
              const completed = groupTasks.filter(task => task.completed).length

              return (
                <article key={group.id} className={`card flex flex-col border-l-4 ${groupColors[index % groupColors.length]}`}>
                  <h3 className="break-words text-base font-semibold [overflow-wrap:anywhere]">{group.name}</h3>
                  <p className="mb-5 mt-2 text-sm text-slate-600">{groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'} · {completed} completed</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <Link to={`/groups/${group.id}`} aria-label={`Open ${group.name}`} className="button-primary">Open Group</Link>
                    <button type="button" onClick={() => setSelectedGroup(group)} aria-label={`Delete ${group.name}`} className="button-danger">Delete Group</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {selectedGroup && (
        <ConfirmDialog
          title="Delete group?"
          message={selectedTaskCount > 0
            ? `Delete "${selectedGroup.name}"? Its ${selectedTaskCount} ${selectedTaskCount === 1 ? 'task will' : 'tasks will'} also be deleted. This cannot be undone.`
            : `Delete "${selectedGroup.name}"? This cannot be undone.`}
          confirmLabel="Delete Group"
          onCancel={() => setSelectedGroup(null)}
          onConfirm={() => {
            deleteGroup(selectedGroup.id)
            setSelectedGroup(null)
          }}
        />
      )}
    </div>
  )
}

export default Groups
