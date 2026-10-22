import { createElement } from 'react'
import { toast as hotToast } from 'react-hot-toast'

import type {
	CustomToastOptions,
	ToastMessage,
	ToastOptions,
	ToastVariant
} from '../model/toast.types'
import { ToastItem } from '../ui/ToastItem'

const showToast = (
	variant: ToastVariant,
	message: ToastMessage,
	options: ToastOptions = {}
) => {
	const { action, description, duration, icon, id } = options

	return hotToast.custom(
		toast =>
			createElement(ToastItem, {
				action,
				description,
				icon,
				id: toast.id,
				message,
				onDismiss: () => hotToast.dismiss(toast.id),
				variant,
				visible: toast.visible
			}),
		{ duration, id }
	)
}

const toast = {
	success: (message: ToastMessage, options?: ToastOptions) =>
		showToast('success', message, options),
	error: (message: ToastMessage, options?: ToastOptions) =>
		showToast('error', message, options),
	warning: (message: ToastMessage, options?: ToastOptions) =>
		showToast('warning', message, options),
	info: (message: ToastMessage, options?: ToastOptions) =>
		showToast('info', message, options),
	custom: (message: ToastMessage, options: CustomToastOptions = {}) =>
		showToast(options.variant ?? 'info', message, options),
	dismiss: (id?: string) => hotToast.dismiss(id),
	dismissAll: () => hotToast.dismiss()
}

export { toast }
