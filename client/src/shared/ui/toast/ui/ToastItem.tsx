import { Check, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'

import { Button } from '@shared/ui/button/Button'

import type { ToastItemProps, ToastVariant } from '../model/toast.types'

import styles from './Toast.module.scss'

const defaultIcons: Record<ToastVariant, typeof Check> = {
	success: Check,
	error: CircleAlert,
	warning: TriangleAlert,
	info: Info
}

const ToastItem = (props: ToastItemProps) => {
	const {
		action,
		description,
		icon,
		message,
		onDismiss,
		variant,
		visible
	} = props

	const DefaultIcon = defaultIcons[variant]
	const isAlert = variant === 'error'

	return (
		<div
			className={styles.toast}
			data-state={visible ? 'open' : 'closed'}
			data-variant={variant}
			role={isAlert ? 'alert' : 'status'}
			aria-live={isAlert ? 'assertive' : 'polite'}
			aria-atomic='true'
		>
			<span className={styles.icon} aria-hidden='true'>
				{icon ?? <DefaultIcon size={18} strokeWidth={2.25} />}
			</span>

			<div className={styles.content}>
				<p className={styles.message}>{message}</p>
				{description ? (
					<p className={styles.description}>{description}</p>
				) : null}
			</div>

			{action ? <div className={styles.action}>{action}</div> : null}

			<Button
				className={styles.closeButton}
				type='button'
				onClick={onDismiss}
				onlyIcon
				ariaLabel='Закрыть уведомление'
				size='sm'
				variant='ghost'
			>
				<X size={16} strokeWidth={2} aria-hidden='true' />
			</Button>
		</div>
	)
}

export { ToastItem }
