import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

function Guide() {
  const quickInstructions = [
    { title: 'Add a Task', text: 'Go to My Task, type a task, then click Add Task or press Enter.', icon: 'plus', color: 'border-blue-100 bg-blue-50/70', accent: 'bg-blue-100 text-blue-700' },
    { title: 'Complete a Task', text: 'Click Not Done to mark it Done. Click Done to change it back.', icon: 'check', color: 'border-green-100 bg-green-50/70', accent: 'bg-green-100 text-green-700' },
    { title: 'Delete a Task', text: 'Click Delete beside a task to remove it from your list.', icon: 'trash', color: 'border-pink-100 bg-pink-50/70', accent: 'bg-pink-100 text-pink-700' },
  ]
  const colors = [
    { card: 'border-blue-100 bg-blue-50/70', badge: 'bg-blue-100 text-blue-700' },
    { card: 'border-purple-100 bg-purple-50/70', badge: 'bg-purple-100 text-purple-700' },
    { card: 'border-green-100 bg-green-50/70', badge: 'bg-green-100 text-green-700' },
    { card: 'border-orange-100 bg-orange-50/70', badge: 'bg-orange-100 text-orange-700' },
    { card: 'border-pink-100 bg-pink-50/70', badge: 'bg-pink-100 text-pink-700' },
  ]
  const instructions = [
    { title: 'Create a task group', text: 'Go to Task Groups, enter a unique name, and click Create Group.', icon: 'folder' },
    { title: 'Open a group', text: 'Click Open Group on the group you want to use. You’ll see only the tasks assigned to that group.', icon: 'arrow' },
    { title: 'Add a task', text: 'In the selected group, enter a task and click Add Task or press Enter. It stays in that group. Use My Task to add and manage ungrouped tasks.', icon: 'plus' },
    { title: 'Mark a task as Done', text: 'Click the Not Done button beside a task. Its status changes to Done and the task is crossed out.', icon: 'checkCircle' },
    { title: 'Change a task back to Not Done', text: 'Click the Done button to make the task pending again. Your task counts update automatically.', icon: 'reset' },
    { title: 'Delete a task', text: 'Click Delete beside the task to remove it immediately.', icon: 'trash' },
    { title: 'Clear tasks from a group', text: 'Open the group and click Clear All Tasks. Confirm to delete its tasks, or choose Cancel to keep them.', icon: 'list' },
    { title: 'Delete a task group', text: 'On Task Groups, click Delete Group and confirm. All tasks in that group are also deleted.', icon: 'folder' },
    { title: 'Navigate between pages', text: 'Use the top navigation to open Dashboard, My Task, Task Groups, User Guide, User Information, or Developers. Use Back to Task Groups to choose another group. The dashboard shows statistics across all your tasks.', icon: 'grid' },
    { title: 'View user information', text: 'Open User Information to view sample names, usernames, emails, and avatars from DummyJSON. A sample profile also appears on the dashboard. Open Developers to meet the project team.', icon: 'users' },
    { title: 'Refresh sample profiles', text: 'Axios retrieves the profiles while a loading message is shown. Click Refresh to reload them. If the request fails, check your connection and click Try Again. You can still manage your tasks while user information is unavailable.', icon: 'reset' },
    { title: 'How your tasks stay up to date', text: 'Zustand keeps tasks and groups in shared state, so task lists and counts update together. Your changes are saved in this browser for your next visit. Tasks stay local; Axios only retrieves sample user information.', icon: 'layers' },
  ]

  return (
    <div className="page-content space-y-7">
      <div><h1 className="page-title">User Guide</h1><p className="page-description">Simple steps to help you get the most out of your to-do list.</p></div>
      <section aria-labelledby="how-to-use-heading">
        <h2 id="how-to-use-heading" className="section-title mb-4">How to Use</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickInstructions.map((instruction, index) => (
            <article key={instruction.title} className={`guide-card ${instruction.color}`}>
              <div className="mb-4 flex items-center justify-between"><span className={`flex size-9 items-center justify-center rounded-xl ${instruction.accent}`}><Icon name={instruction.icon} size={18} /></span><span className="text-xs font-semibold text-slate-500">0{index + 1}</span></div>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">{instruction.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{instruction.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="detailed-guide-heading">
        <h2 id="detailed-guide-heading" className="section-title mb-7">Detailed Guide</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {instructions.map((instruction, index) => {
            const color = colors[index % colors.length]
            return <article key={instruction.title} className={`guide-card ${color.card}`}>
              <div className="mb-4 flex items-center justify-between"><span className={`flex size-10 items-center justify-center rounded-xl ${color.badge}`}><Icon name={instruction.icon} size={20} /></span><span className="text-xs font-semibold text-slate-500">STEP {String(index + 1).padStart(2, '0')}</span></div>
              <h3 className="mb-2 text-base font-semibold tracking-tight text-slate-800">{instruction.title}</h3>
              <p className="text-sm leading-7 text-slate-600">{instruction.text}</p>
            </article>
          })}
        </div>
      </section>
      <Link to="/" className="button-secondary"><Icon name="back" size={16} />Back to Dashboard</Link>
    </div>
  )
}

export default Guide
