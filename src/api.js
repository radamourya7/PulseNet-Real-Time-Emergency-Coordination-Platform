/**
 * Central API fetch helper for PulseNet frontend.
 * In development: relative /api/... paths are proxied by Vite to localhost:5000
 * In production: VITE_API_URL must point to your deployed backend (e.g. https://pulsenet-api.onrender.com)
 */

// Set in .env.local (dev) or Vercel env vars (prod)
export const API_BASE = import.meta.env.VITE_API_URL || ''
export const SOCKET_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token')

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }

    const res = await fetch(`${API_BASE}${path}`, {
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
