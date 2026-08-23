import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { API_BASE_URL } from '@/api/config'

const REALTIME_URL = new URL(API_BASE_URL).origin

let socket: Socket | null = null
let connectedToken: string | null = null

export function ensureRealtimeConnection(token: string): Socket {
  if (socket) {
    if (connectedToken === token) {
      return socket
    }

    // The authenticated session changed; drop the old connection so the
    // previous identity never keeps receiving events.
    socket.disconnect()
    socket = null
  }

  connectedToken = token
  socket = io(REALTIME_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
  })

  return socket
}

export function getRealtimeSocket(): Socket | null {
  return socket
}

export function disconnectRealtime(): void {
  if (!socket) {
    return
  }

  socket.disconnect()
  socket = null
  connectedToken = null
}
