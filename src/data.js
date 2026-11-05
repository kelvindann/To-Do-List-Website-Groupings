export const storageKey = 'todo-list-data'

const defaultGroups = [
  { id: 'school-activities', name: 'School Activities' },
  { id: 'personal-tasks', name: 'Personal Tasks' },
  { id: 'projects', name: 'Projects' },
  { id: 'daily-tasks', name: 'Daily Tasks' },
]

export function createTask(title, groupId = null) {
  const trimmedTitle = title.trim()
  if (!trimmedTitle) return null

  return {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    completed: false,
    groupId,
    createdAt: new Date().toISOString(),
  }
}

export function insertTask(data, task) {
  if (!task || (task.groupId && !data.groups.some(group => group.id === task.groupId))) return data
  return { ...data, tasks: [...data.tasks, task] }
}

export function toggleTask(data, taskId) {
  return {
    ...data,
    tasks: data.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    ),
  }
}

export function deleteTask(data, taskId) {
  return { ...data, tasks: data.tasks.filter(task => task.id !== taskId) }
}

export function insertGroup(data, group) {
  const name = group.name.trim().replace(/\s+/g, ' ')
  if (!name || data.groups.some(item => item.name.toLowerCase() === name.toLowerCase())) return data
  return { ...data, groups: [...data.groups, { ...group, name }] }
}

export function deleteGroup(data, groupId) {
  return {
    groups: data.groups.filter(group => group.id !== groupId),
    tasks: data.tasks.filter(task => task.groupId !== groupId),
  }
}

export function clearGroupTasks(data, groupId) {
  return { ...data, tasks: data.tasks.filter(task => task.groupId !== groupId) }
}

export function loadData(storage) {
  try {
    const saved = JSON.parse((storage === undefined ? globalThis.localStorage : storage)?.getItem(storageKey) ?? null)
    if (saved && Array.isArray(saved.groups) && Array.isArray(saved.tasks)) {
      const groups = saved.groups.filter(group =>
        group && typeof group.id === 'string' && typeof group.name === 'string' && group.name.trim(),
      )
      const tasks = saved.tasks.filter(task =>
        task && typeof task.id === 'string' && typeof task.title === 'string' && task.title.trim() &&
        typeof task.completed === 'boolean' && typeof task.createdAt === 'string' &&
        (task.groupId === null || groups.some(group => group.id === task.groupId)),
      )
      return { groups, tasks }
    }
  } catch {
    return { groups: defaultGroups.map(group => ({ ...group })), tasks: [] }
  }

  return { groups: defaultGroups.map(group => ({ ...group })), tasks: [] }
}
