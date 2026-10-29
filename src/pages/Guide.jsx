function Guide() {
  const colors = [
    { card: 'border-blue-200 bg-blue-50', accent: 'text-blue-700' },
    { card: 'border-purple-200 bg-purple-50', accent: 'text-purple-700' },
    { card: 'border-green-200 bg-green-50', accent: 'text-green-700' },
    { card: 'border-orange-200 bg-orange-50', accent: 'text-orange-700' },
    { card: 'border-pink-200 bg-pink-50', accent: 'text-pink-700' },
  ]
  const instructions = [
    { title: 'Create a task group', text: 'Go to Task Groups, enter a unique name, and click Create Group.' },
    { title: 'Open a group', text: 'Click Open Group on the group you want to use.' },
    { title: 'Add a task', text: 'In the selected group, enter a task and click Add Task or press Enter. It stays in that group. Tasks added on the dashboard are ungrouped.' },
    { title: 'Mark a task as Done', text: 'Check the box beside Not Done. The task will be crossed out and marked Done.' },
    { title: 'Change a task back to Not Done', text: 'Uncheck the box beside Done to make the task pending again.' },
    { title: 'Delete a task', text: 'Click Delete beside the task. It is removed immediately.' },
    { title: 'Clear tasks from a group', text: 'Open the group and click Clear All Tasks. Confirm to delete its tasks, or choose Cancel to keep them.' },
    { title: 'Delete a task group', text: 'On Task Groups, click Delete Group and confirm. All tasks in that group are also deleted.' },
    { title: 'Navigate between pages', text: 'Click the navigation buttons to open the Dashboard, Task Groups, User Guide, or Developers page. Click the Back to Task Groups button to return to the task groups page and choose another group. The Dashboard displays the total number of tasks, completed tasks, and pending tasks.' },
  ]

  return (
    <div>
      <h1 className="page-title">User Guide</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {instructions.map((instruction, index) => (
          <article key={instruction.title} className={`card ${colors[index % colors.length].card}`}>
            <h2 className="mb-2 text-sm font-semibold"><span className={`mr-2 ${colors[index % colors.length].accent}`}>{index + 1}.</span>{instruction.title}</h2>
            <p className="text-sm leading-6 text-slate-600">{instruction.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Guide
