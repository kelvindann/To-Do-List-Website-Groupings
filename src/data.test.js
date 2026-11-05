import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import {
  clearGroupTasks,
  createTask,
  deleteGroup,
  deleteTask,
  insertGroup,
  insertTask,
  loadData,
  storageKey,
  toggleTask,
} from './data.js'

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
const savedValues = new Map()

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: key => savedValues.get(key) ?? null,
    setItem: (key, value) => savedValues.set(key, String(value)),
  },
})

beforeEach(() => savedValues.clear())
after(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

function sampleData() {
  let data = loadData()
  data = insertTask(data, createTask('Dashboard task'))
  data = insertTask(data, createTask('School task', 'school-activities'))
  data = insertTask(data, createTask('Personal task', 'personal-tasks'))
  return data
}

test('first visit creates the four required groups and no example tasks', () => {
  const data = loadData()
  assert.deepEqual(data.groups.map(group => group.name), [
    'School Activities', 'Personal Tasks', 'Projects', 'Daily Tasks',
  ])
  assert.equal(data.tasks.length, 0)
})

test('task creation trims titles, rejects blanks, and supplies unique IDs and dates', () => {
  assert.equal(createTask('   '), null)
  const first = createTask('  Read notes  ')
  const second = createTask('Read notes', 'school-activities')
  assert.equal(first.title, 'Read notes')
  assert.equal(first.groupId, null)
  assert.equal(second.groupId, 'school-activities')
  assert.equal(first.completed, false)
  assert.notEqual(first.id, second.id)
  assert.ok(Number.isFinite(Date.parse(first.createdAt)))
  assert.equal(insertTask(loadData(), null).tasks.length, 0)
  assert.equal(insertTask(loadData(), createTask('Invalid group task', 'missing')).tasks.length, 0)
})

test('completion can be reversed and the original shared state remains unchanged', () => {
  const original = sampleData()
  const taskId = original.tasks[1].id
  const completed = toggleTask(original, taskId)
  assert.equal(completed.tasks.length, 3)
  assert.equal(completed.tasks.filter(task => task.completed).length, 1)
  assert.equal(completed.tasks.filter(task => !task.completed).length, 2)
  assert.equal(original.tasks[1].completed, false)
  const reversed = toggleTask(completed, taskId)
  assert.equal(reversed.tasks.filter(task => task.completed).length, 0)
  assert.equal(reversed.tasks.filter(task => !task.completed).length, 3)
})

test('deleting a task preserves other tasks and groups', () => {
  const original = sampleData()
  const updated = deleteTask(original, original.tasks[1].id)
  assert.deepEqual(updated.tasks.map(task => task.title), ['Dashboard task', 'Personal task'])
  assert.deepEqual(updated.groups, original.groups)
  assert.equal(original.tasks.length, 3)
})

test('group creation normalizes whitespace and rejects blank or duplicate names', () => {
  const original = loadData()
  const updated = insertGroup(original, { id: 'study', name: '  Study   Group  ' })
  assert.equal(updated.groups.at(-1).name, 'Study Group')
  assert.equal(insertGroup(updated, { id: 'duplicate', name: '  sTuDy  gRoUp ' }).groups.length, 5)
  assert.equal(insertGroup(updated, { id: 'blank', name: '   ' }).groups.length, 5)
  assert.equal(insertGroup(updated, { id: 'default-duplicate', name: 'SCHOOL ACTIVITIES' }).groups.length, 5)
})

test('clearing one group removes only its tasks and keeps the group', () => {
  const original = sampleData()
  const updated = clearGroupTasks(original, 'school-activities')
  assert.deepEqual(updated.tasks.map(task => task.title), ['Dashboard task', 'Personal task'])
  assert.equal(updated.tasks.filter(task => task.groupId === 'school-activities').length, 0)
  assert.deepEqual(updated.groups, original.groups)
})

test('deleting a group also deletes its tasks while preserving other groups', () => {
  const updated = deleteGroup(sampleData(), 'school-activities')
  assert.equal(updated.groups.length, 3)
  assert.ok(updated.groups.every(group => group.id !== 'school-activities'))
  assert.deepEqual(updated.tasks.map(task => task.title), ['Dashboard task', 'Personal task'])
  localStorage.setItem(storageKey, JSON.stringify(updated))
  assert.deepEqual(loadData(), updated)
})

test('saved tasks, completion status, and custom groups survive data restoration', () => {
  let data = sampleData()
  data = insertGroup(data, { id: 'custom', name: 'Custom Group' })
  data = insertTask(data, createTask('Custom task', 'custom'))
  data = toggleTask(data, data.tasks.at(-1).id)
  localStorage.setItem(storageKey, JSON.stringify(data))
  assert.deepEqual(loadData(), data)
})

test('deleting every group is preserved rather than recreating defaults', () => {
  localStorage.setItem(storageKey, JSON.stringify({ groups: [], tasks: [] }))
  assert.deepEqual(loadData(), { groups: [], tasks: [] })
})

test('invalid saved data falls back safely and orphan tasks are discarded', () => {
  localStorage.setItem(storageKey, 'invalid JSON')
  assert.equal(loadData().groups.length, 4)
  const data = sampleData()
  data.tasks.push(createTask('Orphan task', 'missing'))
  data.tasks.push({ title: 'Incomplete task' })
  data.groups.push(null)
  localStorage.setItem(storageKey, JSON.stringify(data))
  assert.equal(loadData().tasks.length, 3)
  assert.equal(loadData().groups.length, 4)
})

test('fresh workspaces keep independent default groups', () => {
  const first = loadData()
  first.groups[0].name = 'Temporary name'
  first.groups.push({ id: 'temporary', name: 'Temporary group' })
  const second = loadData()
  assert.equal(second.groups.length, 4)
  assert.equal(second.groups[0].name, 'School Activities')
})
