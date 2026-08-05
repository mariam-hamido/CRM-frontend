export const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL is not defined. Add it to the frontend .env file.'
  )
}

export const REQUEST_TIMEOUT_MS = 10_000

export const AUTH_TOKEN_STORAGE_KEY = 'flowcrm.accessToken'
