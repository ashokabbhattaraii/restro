'use client'

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            const msg =
              error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.'
            toast.error(msg)
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
