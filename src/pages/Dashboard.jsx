import Statistics from '../components/Statistics.jsx'
import Icon from '../components/Icon.jsx'
import UserProfiles from '../components/UserProfiles.jsx'

function Dashboard() {
  return (
    <div className="page-content space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">To-Do List</h1>
          <p className="page-description">Welcome! Organize your tasks and keep track of your progress.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-blue-700"><Icon name="grid" size={14} />Dashboard</span>
      </div>

      <section aria-labelledby="statistics-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="statistics-heading" className="section-title">Task Statistics</h2>
          <span className="text-xs text-slate-500">Across My Task and all groups</span>
        </div>
        <Statistics />
      </section>

      <UserProfiles compact />
    </div>
  )
}

export default Dashboard
