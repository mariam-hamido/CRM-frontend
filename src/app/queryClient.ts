import { QueryClient } from '@tanstack/react-query'

// Module-level singleton so non-component code (auth session cleanup) can clear
// the entire server-state cache on logout or global 401 handling without
// creating a second provider or passing the client through props.
export const queryClient = new QueryClient()
