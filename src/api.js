/**
 * Central API fetch helper for PulseNet frontend.
 * In development: relative /api/... paths are proxied by Vite to localhost:5000
 * In production: VITE_API_URL must point to your deployed backend (e.g. https://pulsenet-api.onrender.com)
 */

// Set in .env.local (dev) or Vercel env vars (prod)
// In DEV: We point directly to port 5005 to avoid port 5000 conflicts and Vite proxy limits
// We prioritize the direct port in DEV even if VITE_API_URL is set to /api
export const API_BASE = import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:5005`
    : (import.meta.env.VITE_API_URL || '')

export const SOCKET_URL = import.meta.env.DEV
    ? `${window.location.protocol}//${window.location.hostname}:5005`
    : (import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5005`)

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token')
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`

    if (import.meta.env.DEV) {
        console.log(`📡 [API Call] ${options.method || 'GET'} ${url}`)
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    }

    try {
        const res = await fetch(url, {
            ...options,
            headers,
            mode: 'cors',
            body: options.body ? JSON.stringify(options.body) : undefined,
        })

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`)
            return data
        } else {
            const text = await res.text()
            console.error('❌ Server returned non-JSON response:', text.substring(0, 200))
            throw new Error(`Server error (${res.status}): Expected JSON but received ${contentType || 'text'}. Check server logs.`)
        }
    } catch (err) {
        console.error('🌐 Fetch Error:', err)
        throw err
    }
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
