import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { AUTH_TOKEN_STORAGE_KEY } from '@/api/config'
import { isAuthenticated } from '@/features/auth/utils/authUtils'
import { clearSession } from '@/features/auth/utils/authUtils'

export const NETWORK_ERROR_MESSAGE =
  'Network error. Please check your connection.'
export const GENERIC_API_ERROR_MESSAGE = 'Something went wrong. Please try again.'
export const UNAUTHORIZED_MESSAGE =
  'Your session has expired. Please sign in again.'

interface ApiErrorPayload {
  success: boolean
  message: string
  errors?: { field: string; message: string }[]
}

export class ApiError extends Error {
  readonly status?: number
  readonly fieldErrors?: { field: string; message: string }[]
  readonly isUnauthorized: boolean

  constructor(
    message: string,
    options: {
      status?: number
      fieldErrors?: { field: string; message: string }[]
      isUnauthorized?: boolean
    } = {}
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.fieldErrors = options.fieldErrors
    this.isUnauthorized = options.isUnauthorized ?? false
  }
}

export function attachAuthToken(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
}

export function handleResponse(response: AxiosResponse) {
  return response
}

// Guard: only one session-expiration flow executes per page lifetime. A hard
// redirect resets everything, so this never needs to be explicitly cleared.
let sessionExpiredHandled = false

export function handleResponseError(error: AxiosError): Promise<never> {
  if (error.response) {
    const { status, data } = error.response
    const payload = data as Partial<ApiErrorPayload> | undefined
    const message = payload?.message ?? GENERIC_API_ERROR_MESSAGE

    // F2 — global 401 handling: clear auth + query cache and hard-redirect to
    // login when an AUTHENTICATED session is rejected. Public endpoints
    // (login/registration) may also return 400-level auth errors but never 401;
    // if they somehow do, the isAuthenticated guard prevents an unnecessary
    // redirect loop — the error is surfaced as a normal form error instead.
    if (
      status === 401 &&
      !sessionExpiredHandled &&
      isAuthenticated()
    ) {
      sessionExpiredHandled = true
      clearSession()
      window.location.href = '/login'
      return Promise.reject(
        new ApiError(message, {
          status,
          fieldErrors: payload?.errors,
          isUnauthorized: true,
        })
      )
    }

    return Promise.reject(
      new ApiError(message, { status, fieldErrors: payload?.errors })
    )
  }

  if (error.request) {
    return Promise.reject(new ApiError(NETWORK_ERROR_MESSAGE))
  }

  return Promise.reject(new ApiError(GENERIC_API_ERROR_MESSAGE))
}
