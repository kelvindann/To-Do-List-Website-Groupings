import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import axios from 'axios'
import { fetchUsers, userApi, userErrorMessage } from './api.js'

const originalAdapter = userApi.defaults.adapter
afterEach(() => { userApi.defaults.adapter = originalAdapter })

const profile = {
  id: 1,
  firstName: 'Sample',
  lastName: 'User',
  email: 'sample@example.com',
  username: 'sampleuser',
  image: 'https://dummyjson.com/icon/sampleuser/128',
}

function response(config, data) {
  return { data, status: 200, statusText: 'OK', headers: {}, config }
}

test('Axios retrieves only the required user fields with a timeout and abort signal', async () => {
  const controller = new AbortController()
  let request
  userApi.defaults.adapter = async config => {
    request = config
    return response(config, { users: [{ ...profile, password: 'unused-example-field' }] })
  }
  assert.deepEqual(await fetchUsers({ signal: controller.signal }), [profile])
  assert.equal(request.baseURL, 'https://dummyjson.com')
  assert.equal(request.url, '/users')
  assert.equal(request.method, 'get')
  assert.equal(request.timeout, 10000)
  assert.deepEqual(request.params, { limit: 6, select: 'id,firstName,lastName,email,username,image' })
  assert.equal(request.signal, controller.signal)
})

test('malformed users are omitted and unsupported avatars use the initials fallback', async () => {
  userApi.defaults.adapter = async config => response(config, {
    users: [null, { id: 2 }, { ...profile, image: 'http://example.com/avatar.png' }],
  })
  assert.deepEqual(await fetchUsers(), [{ ...profile, image: '' }])
})

test('an empty response supports the empty state', async () => {
  userApi.defaults.adapter = async config => response(config, { users: [] })
  assert.deepEqual(await fetchUsers(), [])
})

test('invalid response shapes fail so the interface can show its retry state', async () => {
  for (const data of [null, {}, { users: 'invalid' }, { users: [{ id: 1 }] }]) {
    userApi.defaults.adapter = async config => response(config, data)
    await assert.rejects(fetchUsers(), /Invalid user/)
  }
})

test('network and timeout failures have useful error messages', async () => {
  const failure = new axios.AxiosError('Network Error', 'ERR_NETWORK')
  userApi.defaults.adapter = async () => { throw failure }
  await assert.rejects(fetchUsers(), error => error === failure)
  assert.match(userErrorMessage(failure), /Check your connection/)
  for (const code of ['ECONNABORTED', 'ETIMEDOUT']) {
    assert.match(userErrorMessage(new axios.AxiosError('Timeout', code)), /took too long/)
  }
})

test('an aborted request rejects as cancellation without requesting profiles', async () => {
  let requested = false
  userApi.defaults.adapter = async config => {
    requested = true
    return response(config, { users: [profile] })
  }
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(fetchUsers({ signal: controller.signal }), error => axios.isCancel(error))
  assert.equal(requested, false)
})
