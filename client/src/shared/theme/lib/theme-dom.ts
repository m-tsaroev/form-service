import type { ThemeMode } from '../model/theme.types'

const applyTheme = (mode: ThemeMode) => {
	document.documentElement.dataset.theme = mode
}

export { applyTheme }
