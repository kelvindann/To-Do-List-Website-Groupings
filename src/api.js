import axios from 'axios'

export const userApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

export async function fetchUsers({ signal } = {}) {
  const response = await userApi.get('/users', {
    params: { limit: 6, select: 'id,firstName,lastName,email,username,image' },
    signal,
  })
  if (!Array.isArray(response.data?.users)) throw new Error('Invalid user response')
  const users = response.data.users.filter(user =>
    user && Number.isInteger(user.id) && user.id > 0 &&
    ['firstName', 'lastName', 'email', 'username'].every(key => typeof user[key] === 'string') &&
    `${user.firstName}${user.lastName}`.trim(),
  ).map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    image: typeof user.image === 'string' && user.image.startsWith('https://') ? user.image : '',
  }))
  if (response.data.users.length && !users.length) throw new Error('Invalid user information')
  return users
}

export function userErrorMessage(error) {
  return axios.isAxiosError(error) && ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)
    ? 'The user information request took too long. Please try again.'
    : 'User information could not be loaded. Check your connection and try again.'
}
