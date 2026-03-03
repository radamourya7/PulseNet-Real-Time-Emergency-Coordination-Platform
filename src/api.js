/**
 * Central API fetch helper for PulseNet frontend.
 * Automatically attaches the JWT token from localStorage.
 * Usage: apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })
 */
export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token')

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }

    const res = await fetch(path, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status}`)
    }

    return data
}

/**
 * Decode the JWT payload (no verification — client-side only for UI use).
 */
export function getTokenPayload() {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
        return JSON.parse(atob(token.split('.')[1]))
    } catch {
        return null
    }
}

/**
 * Check if user is logged in (token exists and not expired).
 */
export function isLoggedIn() {
    const payload = getTokenPayload()
    if (!payload) return false
    return payload.exp * 1000 > Date.now()
}

/**
 * Log out: clear token and redirect.
 */
export function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
}
