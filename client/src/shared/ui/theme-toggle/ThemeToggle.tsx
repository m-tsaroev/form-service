import { Moon, Sun } from 'lucide-react'

import { useThemeStore } from '@shared/theme'

import { Button } from '../button/Button'

const ThemeToggle = () => {
	const mode = useThemeStore(state => state.mode)
	const toggleThemeMode = useThemeStore(state => state.toggleThemeMode)

	const isDarkMode = mode === 'dark'

	return (
		<Button
			variant='secondary'
			size='sm'
			onlyIcon
			ariaLabel={isDarkMode ? 'Включить светлую тему' : 'Включить тёмную тему'}
			onClick={toggleThemeMode}
		>
			{isDarkMode ? (
				<Sun size={18} aria-hidden='true' />
			) : (
				<Moon size={18} aria-hidden='true' />
			)}
		</Button>
	)
}

export { ThemeToggle }
