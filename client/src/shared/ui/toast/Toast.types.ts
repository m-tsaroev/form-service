import type { ReactNode } from 'react'

type ToastData = {
	title: string
	description?: ReactNode
	action?: ReactNode
}

type ToastProviderProps = {
	children: ReactNode
}

type ToastContextValue = {
	showToast: (toast: ToastData) => void
}

export type { ToastContextValue, ToastData, ToastProviderProps }
