import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

export const useQueryCache = (queryKey: string) => {
  const queryClient = useQueryClient()
  return queryClient.getQueryData([queryKey] as QueryKey) || { data: null }
}
