import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

/**
 * Returns a shared Socket.IO connection to the backend.
 * Only one connection is created across the whole app.
 */
export function useSocket() {
    const socketRef = useRef(null)

    useEffect(() => {
        if (!socketInstance) {
            socketInstance = io('http://localhost:5000', {
                transports: ['websocket'],
                reconnectionAttempts: 5,
            })
        }
        socketRef.current = socketInstance

        return () => {
            // Don't disconnect on component unmount — keep the singleton alive
        }
    }, [])

    /**
     * Subscribe to a socket event. Automatically unsubscribes on unmount.
     */
    const on = (event, handler) => {
        useEffect(() => {
            if (!socketRef.current) return
            socketRef.current.on(event, handler)
            return () => socketRef.current?.off(event, handler)
        }, [event, handler])
    }

    return { socket: socketRef, on }
}
