import type { ReactNode } from 'react'

import { ToastProvider, TooltipProvider } from '@/shared/ui'

import { QueryProvider } from './query-provider/QueryProvider'
import { ThemeProvider } from './theme-provider/ThemeProvider'

type AppProvidersProps = {
	children: ReactNode
}

const AppProviders = (props: AppProvidersProps) => {
	const { children } = props

	return (
		<QueryProvider>
			<ThemeProvider>
				<TooltipProvider delayDuration={350}>
					{children}
					<ToastProvider />
				</TooltipProvider>
			</ThemeProvider>
		</QueryProvider>
	)
}

export { AppProviders }
