function Developers() {
  const developers = [
    { name: 'Gerald Constantino', color: 'border-blue-200 border-t-blue-500 bg-blue-50 text-blue-800' },
    { name: 'Kelvin dan Dela Cruz', color: 'border-purple-200 border-t-purple-500 bg-purple-50 text-purple-800' },
  ]

  return (
    <div>
      <h1 className="page-title">Developers</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {developers.map(developer => (
          <article key={developer.name} className={`card border-t-4 ${developer.color}`}>
            <h2 className="mb-2 text-base font-semibold">{developer.name}</h2>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Developers
