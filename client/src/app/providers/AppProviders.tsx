import type { ReactNode } from 'react'

import { ThemeProvider } from './theme-provider/ThemeProvider'

type AppProvidersProps = {
	children: ReactNode
}

const AppProviders = (props: AppProvidersProps) => {
	const { children } = props

	return <ThemeProvider>{children}</ThemeProvider>
}

export { AppProviders }
