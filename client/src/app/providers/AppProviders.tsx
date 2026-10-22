import type { ReactNode } from 'react'

import { QueryProvider } from './query-provider/QueryProvider'
import { ThemeProvider } from './theme-provider/ThemeProvider'

type AppProvidersProps = {
	children: ReactNode
}

const AppProviders = (props: AppProvidersProps) => {
	const { children } = props

	return (
		<QueryProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</QueryProvider>
	)
}

export { AppProviders }
