import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

function Developers() {
  const developers = [
    { name: 'Gerald Constantino', image: '/images/developers/gerald-constantino.webp', color: 'border-blue-200 border-t-blue-500 bg-blue-50/60', badge: 'border-blue-200 text-blue-700', label: 'text-blue-700' },
    { name: 'Kelvin dan Dela Cruz', image: '/images/developers/kelvin-dela-cruz.webp', color: 'border-purple-200 border-t-purple-500 bg-purple-50/60', badge: 'border-purple-200 text-purple-700', label: 'text-purple-700' },
  ]

  return (
    <div className="page-content space-y-7">
      <div><h1 className="page-title">Developers</h1><p className="page-description">Meet the team behind this To-Do List website.</p></div>
      <div className="grid gap-5 sm:grid-cols-2">
        {developers.map(developer => (
          <article key={developer.name} className={`card border-t-4 ${developer.color}`}>
            <div className="flex items-center gap-4">
              <img
                src={developer.image}
                alt={developer.name}
                width={480}
                height={480}
                decoding="async"
                className={`size-20 shrink-0 rounded-3xl border-2 bg-white object-cover shadow-sm md:size-24 lg:size-32 ${developer.badge}`}
              />
              <div className="min-w-0 flex-1">
                <h2 className="mb-2 break-words text-lg font-bold tracking-tight text-slate-800 [overflow-wrap:anywhere]">{developer.name}</h2>
                <p className={`text-sm ${developer.label}`}>Project Developer</p>
                <Icon name="code" size={23} className={`mt-3 ${developer.label}`} />
              </div>
            </div>
          </article>
        ))}
      </div>
      <Link to="/" className="button-secondary"><Icon name="back" size={16} />Back to Dashboard</Link>
    </div>
  )
}

export default Developers
