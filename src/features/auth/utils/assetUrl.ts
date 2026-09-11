import { API_BASE_URL } from '@/api/config'

/** Resolves a backend-relative upload path (e.g. `/uploads/avatars/x.jpg`)
 * to an absolute URL the browser can display. Absolute URLs are returned as-is.
 */
export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}