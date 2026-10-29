function Statistics({ tasks }) {
  const completed = tasks.filter(task => task.completed).length
  const statistics = [
    { label: 'Total Tasks', value: tasks.length, color: 'border-blue-200 bg-blue-100 text-blue-800', numberColor: 'text-blue-700' },
    { label: 'Remaining', value: tasks.length - completed, color: 'border-purple-200 bg-purple-100 text-purple-800', numberColor: 'text-purple-700' },
    { label: 'Completed', value: completed, color: 'border-green-200 bg-green-100 text-green-800', numberColor: 'text-green-700' },
  ]

  return (
    <dl className="grid grid-cols-3 gap-2 sm:gap-4" aria-live="polite" aria-atomic="true">
      {statistics.map(statistic => (
        <div key={statistic.label} className={`card px-2 py-4 sm:px-5 ${statistic.color}`}>
          <dt className="text-center text-xs font-medium sm:text-left sm:text-sm">{statistic.label}</dt>
          <dd className={`mt-1 text-center text-2xl font-semibold sm:text-left ${statistic.numberColor}`}>{statistic.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default Statistics
