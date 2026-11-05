import { Link } from 'react-router-dom'
import UserProfiles from '../components/UserProfiles.jsx'
import Icon from '../components/Icon.jsx'

export default function Users() {
  return <div className="page-content space-y-7">
    <div><h1 className="page-title">User Information</h1><p className="page-description">View sample profiles, usernames, and email addresses from DummyJSON.</p></div>
    <UserProfiles />
    <Link to="/" className="button-secondary"><Icon name="back" size={16} />Back to Dashboard</Link>
  </div>
}
