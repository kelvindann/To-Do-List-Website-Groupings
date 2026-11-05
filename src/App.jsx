import { useEffect, useRef } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import MyTask from './pages/MyTask.jsx'
import Groups from './pages/Groups.jsx'
import GroupTasks from './pages/GroupTasks.jsx'
import Guide from './pages/Guide.jsx'
import Developers from './pages/Developers.jsx'
import Users from './pages/Users.jsx'
import Icon from './components/Icon.jsx'
import InteractiveBackground from './components/InteractiveBackground.jsx'
import useTodoStore from './hooks/useTodoStore.js'

function App() {
  const storageError = useTodoStore(state => state.storageError)
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const mainRef = useRef(null)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [pathname])

  const navigation = [
    { to: '/', label: 'Dashboard', icon: 'grid' },
    { to: '/my-task', label: 'My Task', icon: 'list' },
    { to: '/groups', label: 'Task Groups', icon: 'folder' },
    { to: '/guide', label: 'User Guide', icon: 'help' },
    { to: '/users', label: 'User Information', icon: 'users' },
    { to: '/developers', label: 'Developers', icon: 'code' },
  ]

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-7 sm:py-9">
        <header className="navigation-panel">
          <nav aria-label="Main navigation" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
            {navigation.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `navigation-link ${isActive ? 'navigation-link-active' : ''}`
                }
              >
                <Icon name={item.icon} size={18} />{item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main ref={mainRef} id="main-content" tabIndex={-1} className="outline-none">
          {storageError && <p role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{storageError}</p>}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-task" element={<MyTask />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<GroupTasks />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/users" element={<Users />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="*" element={
              <section className="card space-y-4">
                <h1 className="page-title">Page not found</h1>
                <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">Return to the dashboard</Link>
              </section>
            } />
          </Routes>
        </main>
      </div>
      <InteractiveBackground />
    </div>
  )
}

export default App
