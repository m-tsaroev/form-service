import clsx from 'clsx'
import { LoaderCircle } from 'lucide-react'

import styles from './Spinner.module.scss'
import type { SpinnerProps } from './Spinner.types'

const Spinner = (props: SpinnerProps) => {
	const { className, size = 'md', label = 'Загрузка', ...rest } = props

	return (
		<span
			className={clsx(styles.spinner, styles[size], className)}
			role='status'
			aria-label={label}
			{...rest}
		>
			<LoaderCircle
				className={styles.icon}
				aria-hidden='true'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</span>
	)
}

export { Spinner }
