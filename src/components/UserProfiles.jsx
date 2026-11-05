import { useState } from 'react'
import { Link } from 'react-router-dom'
import useUsers from '../hooks/useUsers.js'
import Icon from './Icon.jsx'

function UserAvatar({ user }) {
  const [failed, setFailed] = useState(false)
  return <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 text-lg font-semibold text-blue-700">
    {user.image && !failed ? <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="size-full object-cover" width="56" height="56" loading="lazy" onError={() => setFailed(true)} /> : <span aria-label={`${user.firstName} ${user.lastName}`}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>}
  </span>
}

export default function UserProfiles({ compact = false }) {
  const { users, status, error, reload } = useUsers()
  const displayedUsers = compact ? users.slice(0, 1) : users

  return <section className="card" aria-label="Sample user information" aria-busy={status === 'loading'}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><span className="section-icon bg-purple-50 text-purple-600"><Icon name="users" size={21} /></span><div><h2 className="section-title">Sample User Information</h2><p className="section-description">Retrieved from the DummyJSON API</p></div></div>
      <button type="button" className="button-secondary" disabled={status === 'loading'} onClick={reload} aria-label="Refresh user information"><Icon name="reset" size={15} />Refresh</button>
    </div>

    {status === 'loading' && <div role="status" className="flex min-h-28 items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-7 text-sm text-blue-700"><span className="size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 motion-reduce:animate-none" aria-hidden="true" />Loading user information…</div>}
    {status === 'error' && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-medium text-amber-900">{error}</p><p className="mt-1.5 text-xs text-amber-800">Your tasks and groups are still available.</p><button type="button" onClick={reload} className="button-secondary mt-4"><Icon name="reset" size={15} />Try Again</button></div>}
    {status === 'success' && !users.length && <p className="rounded-xl bg-slate-50 px-4 py-7 text-center text-sm text-slate-600">No sample users were returned. Use Refresh to try again.</p>}
    {status === 'success' && displayedUsers.length > 0 && <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
      {displayedUsers.map(user => <article key={user.id} className="flex min-w-0 items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <UserAvatar key={`${user.id}-${user.image}`} user={user} />
        <div className="min-w-0 flex-1"><h3 className="break-words text-base font-semibold text-slate-800 [overflow-wrap:anywhere]">{user.firstName} {user.lastName}</h3><dl className="mt-2 space-y-1.5 text-sm"><div className="flex flex-wrap gap-x-1.5"><dt className="text-slate-500">Username:</dt><dd className="break-all text-slate-700">@{user.username}</dd></div><div><dt className="sr-only">Email</dt><dd className="break-all text-blue-700">{user.email}</dd></div></dl></div>
      </article>)}
    </div>}
    {compact && <Link to="/users" className="back-link mt-4">View User Information<Icon name="arrow" size={15} /></Link>}
  </section>
}
