import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { QueryProviderProps } from './QueryProvider.types'

const queryClient = new QueryClient()

const QueryProvider = (props: QueryProviderProps) => {
	const { children } = props

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

export { QueryProvider }
