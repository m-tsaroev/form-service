import type { ReactNode } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastMessage = string | ReactNode

export type ToastOptions = {
	action?: ReactNode
	description?: ToastMessage
	duration?: number
	id?: string
	icon?: ReactNode
}

export type CustomToastOptions = ToastOptions & {
	variant?: ToastVariant
}

export type ToastItemProps = {
	action?: ReactNode
	description?: ToastMessage
	id: string
	icon?: ReactNode
	message: ToastMessage
	onDismiss: () => void
	variant: ToastVariant
	visible: boolean
}
