import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Icon from '../components/Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function Groups() {
  const groups = useTodoStore(state => state.groups)
  const tasks = useTodoStore(state => state.tasks)
  const addGroup = useTodoStore(state => state.addGroup)
  const deleteGroup = useTodoStore(state => state.deleteGroup)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)
  const submitted = useRef(false)
  const inputRef = useRef(null)
  const groupColors = [
    { card: 'border-blue-200 border-l-blue-500 bg-blue-50/70', icon: 'text-blue-600', bar: 'bg-blue-400' },
    { card: 'border-purple-200 border-l-purple-500 bg-purple-50/70', icon: 'text-purple-600', bar: 'bg-purple-400' },
    { card: 'border-green-200 border-l-green-500 bg-green-50/70', icon: 'text-green-600', bar: 'bg-green-400' },
    { card: 'border-orange-200 border-l-orange-400 bg-orange-50/70', icon: 'text-orange-600', bar: 'bg-orange-400' },
  ]
  const groupIcons = { 'school-activities': 'graduation', 'personal-tasks': 'heart', projects: 'layers', 'daily-tasks': 'calendar' }

  function handleSubmit(event) {
    event.preventDefault()
    if (submitted.current) return
    const message = addGroup(name)
    setError(message)
    if (!message) { submitted.current = true; setName('') }
    inputRef.current.focus()
  }

  const selectedTaskCount = selectedGroup ? tasks.filter(task => task.groupId === selectedGroup.id).length : 0

  return (
    <div className="page-content space-y-7">
      <div><h1 className="page-title">Task Groups</h1><p className="page-description">Keep related tasks together, from school activities to everyday plans.</p></div>

      <section className="card" aria-labelledby="create-group-heading">
        <div className="section-heading"><span className="section-icon bg-purple-50 text-purple-600"><Icon name="folder" size={21} /></span><div><h2 id="create-group-heading" className="section-title">Create a New Group</h2><p className="section-description">Give your tasks a place of their own.</p></div></div>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="group-name" className="mb-2 block text-sm font-medium">Group name</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input ref={inputRef} id="group-name" type="text" value={name} onChange={event => { submitted.current = false; setName(event.target.value); setError('') }} placeholder="Enter a group name" autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? 'group-error' : undefined} className="text-input min-w-0 flex-1" />
            <button type="submit" disabled={!name.trim()} className="button-primary"><Icon name="plus" size={18} />Create Group</button>
          </div>
          {error && <p id="group-error" role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </form>
      </section>

      <section aria-labelledby="your-groups-heading">
        <div className="mb-4 flex items-center gap-2.5"><h2 id="your-groups-heading" className="section-title">Your Groups</h2><span className="count-badge">{groups.length}</span></div>
        {groups.length === 0 ? (
          <div className="empty-state"><Icon name="folder" size={30} className="mb-3 text-blue-400" /><p className="text-sm font-semibold text-slate-700">No groups yet</p><p className="mt-1.5 text-sm text-slate-500">Create a group above to organize your tasks.</p></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group, index) => {
              const groupTasks = tasks.filter(task => task.groupId === group.id)
              const completed = groupTasks.filter(task => task.completed).length
              const colors = groupColors[index % groupColors.length]
              const progress = groupTasks.length ? Math.round(completed / groupTasks.length * 100) : 0
              return (
                <article key={group.id} className={`group-card ${colors.card}`}>
                  <div className="mb-4 flex items-center justify-between"><span className={`flex size-11 items-center justify-center rounded-xl border border-white bg-white/80 shadow-sm ${colors.icon}`}><Icon name={groupIcons[group.id] || 'folder'} size={23} /></span><span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600">{groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'}</span></div>
                  <h3 className="break-words text-lg font-semibold tracking-tight text-slate-800 [overflow-wrap:anywhere]">{group.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{completed} completed · {groupTasks.length - completed} remaining</p>
                  <div className="mb-6 mt-4 h-1.5 overflow-hidden rounded-full bg-white/90" aria-hidden="true"><div className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${colors.bar}`} style={{ width: `${progress}%` }} /></div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <Link to={`/groups/${encodeURIComponent(group.id)}`} aria-label={`Open ${group.name}`} className="button-primary">Open Group<Icon name="arrow" size={16} /></Link>
                    <button type="button" onClick={() => setSelectedGroup(group)} aria-label={`Delete ${group.name}`} className="button-danger"><Icon name="trash" size={15} />Delete Group</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {selectedGroup && <ConfirmDialog title="Delete group?" message={selectedTaskCount > 0 ? `Delete "${selectedGroup.name}"? Its ${selectedTaskCount} ${selectedTaskCount === 1 ? 'task will' : 'tasks will'} also be deleted. This cannot be undone.` : `Delete "${selectedGroup.name}"? This cannot be undone.`} confirmLabel="Delete Group" onCancel={() => setSelectedGroup(null)} onConfirm={() => { deleteGroup(selectedGroup.id); setSelectedGroup(null) }} />}
    </div>
  )
}

export default Groups
