import { Toaster } from 'react-hot-toast'

import styles from './Toast.module.scss'

const ToastProvider = () => (
	<Toaster
		position='bottom-right'
		reverseOrder={false}
		gutter={12}
		containerClassName={styles.container}
		toastOptions={{
			duration: 4000,
			removeDelay: 180
		}}
	/>
)

export { ToastProvider }
