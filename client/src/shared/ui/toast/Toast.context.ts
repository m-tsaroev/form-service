import { createContext, useContext } from 'react'

import type { ToastContextValue } from './Toast.types'

const ToastContext = createContext<ToastContextValue | null>(null)

const useToast = () => {
	const context = useContext(ToastContext)

	if (!context) {
		throw new Error('useToast must be used within ToastProvider')
	}

	return context
}

export { ToastContext, useToast }
