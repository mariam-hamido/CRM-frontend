import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthUser } from '@/features/auth/types/auth.types'

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
    }
  )
)

export const selectUser = (state: AuthState) => state.user
export const selectToken = (state: AuthState) => state.token
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectIsLoading = (state: AuthState) => state.isLoading
