export type ThemeMode = 'light' | 'dark'

export type ThemeStoreActions = {
	setThemeMode: (themeMode: ThemeMode) => void
	toggleThemeMode: () => void
}

export type ThemeStoreState = {
	mode: ThemeMode
} & ThemeStoreActions
