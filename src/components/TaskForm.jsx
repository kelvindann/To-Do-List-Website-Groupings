import { useRef, useState } from 'react'
import Icon from './Icon.jsx'
import useTodoStore from '../hooks/useTodoStore.js'

function TaskForm({ groupId = null }) {
  const addTask = useTodoStore(state => state.addTask)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const submitted = useRef(false)
  const inputRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    if (submitted.current) return
    if (!title.trim()) {
      setError('Enter a task before adding it.')
      inputRef.current.focus()
      return
    }

    if (!addTask(title, groupId)) {
      setError('This group is no longer available. Choose another group to add your task.')
      inputRef.current.focus()
      return
    }
    submitted.current = true
    setTitle('')
    setError('')
    inputRef.current.focus()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-title" className="mb-2 block text-sm font-medium">Task name</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id="task-title"
          type="text"
          value={title}
          onChange={event => {
            submitted.current = false
            setTitle(event.target.value)
            setError('')
          }}
          placeholder="Enter a new task"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-error' : 'task-hint'}
          className="text-input min-w-0 flex-1"
        />
        <button type="submit" disabled={!title.trim()} className="button-primary"><Icon name="plus" size={18} />Add Task</button>
      </div>
      {error ? (
        <p id="task-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>
      ) : (
        <p id="task-hint" className="mt-3 text-xs text-slate-500">Press <kbd className="mx-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px]">Enter</kbd> to add your task.</p>
      )}
    </form>
  )
}

export default TaskForm
