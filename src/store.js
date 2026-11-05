import { createStore } from 'zustand/vanilla'
import {
  clearGroupTasks, createTask, deleteGroup, deleteTask, insertGroup,
  insertTask, loadData, storageKey, toggleTask,
} from './data.js'

function browserStorage() {
  try { return globalThis.localStorage } catch { return null }
}

export function createTodoStore({ storage = browserStorage(), initialData = loadData(storage) } = {}) {
  const store = createStore((set, get) => ({
    groups: initialData.groups,
    tasks: initialData.tasks,
    storageError: '',

    addTask(title, groupId = null) {
      const task = createTask(title, groupId)
      const current = get()
      if (!task || (groupId !== null && !current.groups.some(group => group.id === groupId))) return false
      set(state => insertTask(state, task))
      return true
    },
    toggleTask: taskId => set(state => toggleTask(state, taskId)),
    deleteTask: taskId => set(state => deleteTask(state, taskId)),
    clearGroupTasks: groupId => set(state => clearGroupTasks(state, groupId)),
    deleteGroup: groupId => set(state => deleteGroup(state, groupId)),

    addGroup(name) {
      const cleanedName = name.trim().replace(/\s+/g, ' ')
      if (!cleanedName) return 'Enter a group name.'
      if (get().groups.some(group => group.name.toLowerCase() === cleanedName.toLowerCase())) {
        return 'A group with this name already exists.'
      }
      set(state => insertGroup(state, { id: crypto.randomUUID(), name: cleanedName }))
      return ''
    },
  }))

  // Keep the original storage format so existing tasks and groups are preserved.
  store.subscribe((state, previous) => {
    if (state.tasks === previous.tasks && state.groups === previous.groups) return
    try {
      if (!storage) throw new Error('Storage unavailable')
      storage.setItem(storageKey, JSON.stringify({ groups: state.groups, tasks: state.tasks }))
      if (state.storageError) store.setState({ storageError: '' })
    } catch {
      store.setState({ storageError: 'Your browser couldn’t save these changes. Keep this tab open; changes may be lost on refresh.' })
    }
  })

  return store
}
