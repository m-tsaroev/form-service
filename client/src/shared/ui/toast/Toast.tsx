import { X } from 'lucide-react'
import { Toast as ToastPrimitive } from 'radix-ui'
import { useState } from 'react'

import { ToastContext } from './Toast.context'
import styles from './Toast.module.scss'
import type { ToastData, ToastProviderProps } from './Toast.types'

const ToastProvider = (props: ToastProviderProps) => {
	const { children } = props
	const [open, setOpen] = useState(false)
	const [toast, setToast] = useState<ToastData | null>(null)

	const showToast = (nextToast: ToastData) => {
		setToast(nextToast)
		setOpen(true)
	}

	return (
		<ToastContext.Provider value={{ showToast }}>
			<ToastPrimitive.Provider duration={7000} swipeDirection='right'>
				{children}
				{toast && (
					<ToastPrimitive.Root
						className={styles.toast}
						open={open}
						onOpenChange={setOpen}
					>
						<div className={styles.content}>
							<ToastPrimitive.Title className={styles.title}>
								{toast.title}
							</ToastPrimitive.Title>
							{toast.description && (
								<ToastPrimitive.Description className={styles.description}>
									{toast.description}
								</ToastPrimitive.Description>
							)}
						</div>
						{toast.action && (
							<ToastPrimitive.Action
								asChild
								altText='Открыть опубликованную форму'
							>
								{toast.action}
							</ToastPrimitive.Action>
						)}
						<ToastPrimitive.Close
							className={styles.close}
							aria-label='Закрыть уведомление'
						>
							<X size={16} aria-hidden='true' />
						</ToastPrimitive.Close>
					</ToastPrimitive.Root>
				)}
				<ToastPrimitive.Viewport className={styles.viewport} />
			</ToastPrimitive.Provider>
		</ToastContext.Provider>
	)
}

export { ToastProvider }
