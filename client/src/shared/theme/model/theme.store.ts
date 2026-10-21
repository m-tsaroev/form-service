import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { ThemeStoreState } from '@shared/theme/model/theme.types'

import { applyTheme } from '../lib/theme-dom'

export const useThemeStore = create<ThemeStoreState>()(
	persist(
		(set, get) => ({
			mode: 'light',
			setThemeMode: themeMode => set({ mode: themeMode }),
			toggleThemeMode: () => {
				const mode = get().mode === 'light' ? 'dark' : 'light'

				set({ mode })
			}
		}),
		{
			name: 'theme',
			onRehydrateStorage: () => state => {
				if (state) {
					applyTheme(state.mode)
				}
			}
		}
	)
)
