import { Outlet } from 'react-router'

import styles from './AdminLayout.module.scss'

const AdminLayout = () => {
	return (
		<>
			<main className={styles.content}>
				<Outlet />
			</main>
		</>
	)
}

export { AdminLayout }
