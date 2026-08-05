import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { AUTH_TOKEN_STORAGE_KEY } from '@/api/config'

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

export function handleResponseError(error: AxiosError): Promise<never> {
  if (error.response) {
    const { status, data } = error.response
    const payload = data as Partial<ApiErrorPayload> | undefined
    const message = payload?.message ?? GENERIC_API_ERROR_MESSAGE

    if (status === 401) {
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
