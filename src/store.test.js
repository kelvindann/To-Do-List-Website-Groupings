import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTodoStore } from './store.js'
import { storageKey } from './data.js'

function memoryStorage() {
  const values = new Map()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  }
}

function fixture(storage = memoryStorage()) {
  return createTodoStore({
    initialData: {
      groups: [{ id: 'school', name: 'School' }, { id: 'personal', name: 'Personal' }],
      tasks: [],
    },
    storage,
  })
}

test('task actions update every subscriber and completion can be reversed', () => {
  const store = fixture()
  const initial = store.getState()
  let statistics
  let schoolTasks
  const stopStatistics = store.subscribe(state => {
    statistics = { total: state.tasks.length, completed: state.tasks.filter(task => task.completed).length }
  })
  const stopList = store.subscribe(state => { schoolTasks = state.tasks.filter(task => task.groupId === 'school') })

  assert.equal(initial.addTask('Review the layout'), true)
  assert.equal(initial.addTask('Submit the activity', 'school'), true)
  const taskId = schoolTasks[0].id
  initial.toggleTask(taskId)
  assert.deepEqual(statistics, { total: 2, completed: 1 })
  assert.equal(schoolTasks[0].completed, true)
  assert.equal(initial.tasks.length, 0)

  initial.toggleTask(taskId)
  assert.deepEqual(statistics, { total: 2, completed: 0 })
  initial.deleteTask(taskId)
  assert.deepEqual(statistics, { total: 1, completed: 0 })
  assert.deepEqual(schoolTasks, [])
  assert.equal(store.getState().addTask, initial.addTask)
  stopStatistics()
  stopList()
})

test('store actions validate task destinations and normalize group names', () => {
  const store = fixture()
  const actions = store.getState()
  assert.equal(actions.addTask('   '), false)
  assert.equal(actions.addTask('Missing group', 'missing'), false)
  assert.equal(store.getState().tasks.length, 0)
  assert.equal(actions.addGroup('  Weekly   Plan  '), '')
  assert.equal(store.getState().groups.at(-1).name, 'Weekly Plan')
  assert.equal(actions.addGroup('weekly plan'), 'A group with this name already exists.')
  assert.equal(actions.addGroup('  '), 'Enter a group name.')
  assert.equal(store.getState().groups.length, 3)
})

test('clearing and deleting a group preserve other tasks and usable store actions', () => {
  const store = fixture()
  const actions = store.getState()
  actions.addTask('Dashboard task')
  actions.addTask('School task', 'school')
  actions.addTask('Personal task', 'personal')
  actions.clearGroupTasks('school')
  assert.deepEqual(store.getState().tasks.map(task => task.title), ['Dashboard task', 'Personal task'])
  assert.equal(store.getState().groups.length, 2)

  actions.addTask('Another school task', 'school')
  actions.deleteGroup('school')
  assert.deepEqual(store.getState().groups.map(group => group.id), ['personal'])
  assert.deepEqual(store.getState().tasks.map(task => task.title), ['Dashboard task', 'Personal task'])
  assert.equal(store.getState().addTask('Another personal task', 'personal'), true)
  assert.equal(store.getState().addGroup('Projects'), '')
})

test('existing saved data loads and persists without changing its format or extra metadata', () => {
  const storage = memoryStorage()
  const saved = {
    groups: [{ id: 'custom', name: 'Custom Group' }],
    tasks: [{ id: 'saved-task', title: 'Keep my task', completed: false, groupId: 'custom', createdAt: '2026-11-01T08:00:00.000Z', priority: 'high' }],
  }
  storage.setItem(storageKey, JSON.stringify(saved))
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  try {
    const store = createTodoStore()
    assert.deepEqual(store.getState().groups, saved.groups)
    assert.deepEqual(store.getState().tasks, saved.tasks)
    store.getState().toggleTask('saved-task')
    const persisted = JSON.parse(storage.getItem(storageKey))
    assert.deepEqual(Object.keys(persisted).sort(), ['groups', 'tasks'])
    assert.equal(persisted.tasks[0].completed, true)
    assert.equal(persisted.tasks[0].priority, 'high')
    const restored = createTodoStore()
    assert.deepEqual(restored.getState().tasks, persisted.tasks)
    assert.equal(typeof restored.getState().deleteTask, 'function')
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original)
    else delete globalThis.localStorage
  }
})

test('a supplied storage instance is used for both restoring and saving tasks', () => {
  const storage = memoryStorage()
  const saved = {
    groups: [{ id: 'custom-storage', name: 'Custom Storage' }],
    tasks: [{ id: 'stored-task', title: 'Restore from the supplied storage', completed: false, groupId: 'custom-storage', createdAt: '2026-11-01T08:00:00.000Z' }],
  }
  storage.setItem(storageKey, JSON.stringify(saved))

  const store = createTodoStore({ storage })
  assert.deepEqual(store.getState().groups, saved.groups)
  assert.deepEqual(store.getState().tasks, saved.tasks)
  store.getState().toggleTask('stored-task')
  assert.equal(JSON.parse(storage.getItem(storageKey)).tasks[0].completed, true)
  assert.equal(createTodoStore({ storage }).getState().tasks[0].completed, true)
})

test('save failures retain tasks in memory and recover when storage works again', () => {
  const storage = memoryStorage()
  const save = storage.setItem
  let shouldFail = true
  storage.setItem = (key, value) => {
    if (shouldFail) throw new Error('Storage quota exceeded')
    save(key, value)
  }
  const store = fixture(storage)
  assert.equal(store.getState().addTask('Keep this task'), true)
  assert.equal(store.getState().tasks.length, 1)
  assert.match(store.getState().storageError, /couldn’t save/)

  shouldFail = false
  store.getState().addTask('Save both tasks')
  assert.equal(store.getState().storageError, '')
  assert.deepEqual(JSON.parse(storage.getItem(storageKey)).tasks.map(task => task.title), ['Keep this task', 'Save both tasks'])
})

test('unavailable browser storage still permits task actions', () => {
  const store = fixture(null)
  store.getState().addTask('Temporary task')
  const task = store.getState().tasks[0]
  store.getState().toggleTask(task.id)
  assert.equal(store.getState().tasks[0].completed, true)
  assert.match(store.getState().storageError, /may be lost on refresh/)
})
