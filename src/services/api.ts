const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '')

export const apiUrl = (path: string) => `${apiBaseUrl}/${path.replace(/^\//, '')}`

export const publicFetch = (path: string, init: RequestInit = {}) => fetch(apiUrl(path), init)

export const apiFetch = async (path: string, init: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  const headers = new Headers(init.headers)

  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(apiUrl(path), { ...init, headers })
  if (response.status === 401) localStorage.removeItem('token')
  return response
}
