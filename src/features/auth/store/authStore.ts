// Authentication lifecycle
// ------------------------
// 1. login(user, token)      -> updates the Zustand store and persists under
//                               'flowcrm.auth'. The token is mirrored to
//                               AUTH_TOKEN_STORAGE_KEY ('flowcrm.accessToken'),
//                               the single key the Axios request interceptor reads.
// 2. Page refresh            -> persist rehydrates { user, token } synchronously
//                               from 'flowcrm.auth'; merge recomputes
//                               isAuthenticated; onRehydrateStorage re-mirrors the
//                               token so the interceptor is consistent immediately.
// 3. logout() / clearAuth()  -> resets the store and removes both keys.
// The store never talks to Axios and Axios never reads the store; the only shared
// contract between them is AUTH_TOKEN_STORAGE_KEY.
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AUTH_TOKEN_STORAGE_KEY } from '@/api/config'
import type { AuthUser } from '@/features/auth/types/auth.types'

function syncToken(token: string | null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setToken: (token: string | null) => void
  login: (user: AuthUser, token: string) => void
  logout: () => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: Boolean(user && state.token),
        })),
      setToken: (token) =>
        set((state) => ({
          token,
          isAuthenticated: Boolean(state.user && token),
        })),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'flowcrm.auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AuthState> | undefined
        return {
          ...currentState,
          ...persisted,
          isAuthenticated: Boolean(persisted?.user && persisted?.token),
        }
      },
      onRehydrateStorage: () => (state) => {
        syncToken(state?.token ?? null)
      },
    }
  )
)

// Mirror every token change (login, logout, setToken) into the storage key the
// Axios request interceptor reads, so requests always send the latest JWT.
useAuthStore.subscribe((state, previousState) => {
  if (state.token !== previousState.token) {
    syncToken(state.token)
  }
})

export const selectUser = (state: AuthState) => state.user
export const selectToken = (state: AuthState) => state.token
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectIsLoading = (state: AuthState) => state.isLoading
