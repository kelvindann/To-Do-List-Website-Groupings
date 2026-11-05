import { useEffect, useState } from 'react'
import axios from 'axios'
import { fetchUsers, userErrorMessage } from '../api.js'

export default function useUsers() {
  const [state, setState] = useState({ users: [], status: 'loading', error: '' })
  const [request, setRequest] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    fetchUsers({ signal: controller.signal })
      .then(users => { if (active) setState({ users, status: 'success', error: '' }) })
      .catch(error => {
        if (active && !axios.isCancel(error)) setState({ users: [], status: 'error', error: userErrorMessage(error) })
      })
    return () => { active = false; controller.abort() }
  }, [request])

  function reload() {
    setState({ users: [], status: 'loading', error: '' })
    setRequest(current => current + 1)
  }

  return { ...state, reload }
}
