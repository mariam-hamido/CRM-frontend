import {
  selectIsAuthenticated,
  selectToken,
  useAuthStore,
} from '@/features/auth/store/authStore'

/** Returns the current JWT from the store, or null when signed out. */
export function getToken(): string | null {
  return selectToken(useAuthStore.getState())
}

/** Returns whether a user and token are currently present in the store. */
export function isAuthenticated(): boolean {
  return selectIsAuthenticated(useAuthStore.getState())
}

/**
 * Fully clears authentication: resets the Zustand state, removes the persisted
 * 'flowcrm.auth' entry, and (via the store's token subscription) removes the
 * 'flowcrm.accessToken' key the Axios interceptor reads.
 */
export function clearAuth(): void {
  useAuthStore.getState().logout()
  void useAuthStore.persist.clearStorage()
}
