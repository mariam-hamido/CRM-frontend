import axios from 'axios'
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '@/api/config'
import {
  attachAuthToken,
  handleResponse,
  handleResponseError,
} from '@/api/interceptors'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(attachAuthToken)

apiClient.interceptors.response.use(handleResponse, handleResponseError)

export default apiClient
