import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Groups from './pages/Groups.jsx'
import GroupTasks from './pages/GroupTasks.jsx'
import Guide from './pages/Guide.jsx'
import Developers from './pages/Developers.jsx'
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

function App() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Tasks and groups could not be saved in localStorage.', error)
    }
  }, [data])

  function addTask(title, groupId = null) {
    const task = createTask(title, groupId)
    if (task) setData(current => insertTask(current, task))
  }

  function addGroup(name) {
    const cleanedName = name.trim().replace(/\s+/g, ' ')
    if (!cleanedName) return 'Enter a group name.'
    if (data.groups.some(group => group.name.toLowerCase() === cleanedName.toLowerCase())) {
      return 'A group with this name already exists.'
    }

    const group = { id: crypto.randomUUID(), name: cleanedName }
    setData(current => insertGroup(current, group))
    return ''
  }

  const taskActions = {
    addTask,
    toggleTask: taskId => setData(current => toggleTask(current, taskId)),
    deleteTask: taskId => setData(current => deleteTask(current, taskId)),
  }
  const navigation = [
    { to: '/', label: 'Dashboard' },
    { to: '/groups', label: 'Task Groups' },
    { to: '/guide', label: 'User Guide' },
    { to: '/developers', label: 'Developers' },
  ]

  return (
    <div className="min-h-screen bg-indigo-50 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-7 rounded-lg border border-blue-200 border-t-4 border-t-blue-600 bg-blue-50 p-2 shadow-sm">
          <nav aria-label="Main navigation" className="grid grid-cols-2 gap-1 sm:flex sm:gap-2">
            {navigation.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-center text-sm font-medium transition-colors duration-150 motion-reduce:transition-none ${
                    isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-purple-700 hover:bg-purple-100 hover:text-purple-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard tasks={data.tasks} {...taskActions} />} />
            <Route path="/groups" element={<Groups groups={data.groups} tasks={data.tasks} addGroup={addGroup} deleteGroup={groupId => setData(current => deleteGroup(current, groupId))} />} />
            <Route path="/groups/:groupId" element={<GroupTasks groups={data.groups} tasks={data.tasks} clearGroupTasks={groupId => setData(current => clearGroupTasks(current, groupId))} {...taskActions} />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="*" element={
              <section className="card">
                <h1 className="page-title">Page not found</h1>
                <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">Return to the dashboard</Link>
              </section>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
