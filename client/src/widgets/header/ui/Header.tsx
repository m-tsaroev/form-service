import { Link } from 'react-router'

import { ROUTES } from '@shared/config'
import { ThemeToggle } from '@shared/ui'

import styles from './Header.module.scss'

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<Link className={styles.logo} to={ROUTES.ADMIN}>
					Формы
				</Link>

				<ThemeToggle />
			</div>
		</header>
	)
}

export { Header }
