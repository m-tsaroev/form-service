import { Theme } from '@radix-ui/themes'
import { useThemeStore } from '@shared/theme'
import { applyTheme } from '@shared/theme/lib/theme-dom'
import { useLayoutEffect } from 'react'

import type { ThemeProviderProps } from './ThemeProvider.types'

const ThemeProvider = (props: ThemeProviderProps) => {
	const { children } = props

	const mode = useThemeStore(s => s.mode)

	useLayoutEffect(() => {
		applyTheme(mode)
	}, [mode])

	return <Theme appearance={mode}>{children}</Theme>
}

export { ThemeProvider }
