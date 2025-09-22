import { useQueryClient } from '@tanstack/react-query'

export const useRefetchInvalidateQuery = () => {
  const queryClient = useQueryClient()
  const refetch = (qKey: string) => {
    // Invalidate and refetch a specific query
    // @ts-expect-error: TS2345
    queryClient.invalidateQueries(qKey)
  }

  return { refetch }
}
