import type { FormField } from '@/entities/form'

type FormFieldPreviewProps = {
	field: FormField
	formId: number
	isDisabled: boolean
	isDirty: boolean
	isSelected: boolean
	onSelect: (fieldId: number) => void
}

export type { FormFieldPreviewProps }
