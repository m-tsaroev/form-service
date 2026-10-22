import type { FormField } from '@/entities/form'

type FieldSettingsProps = {
	field: FormField | null
	formId: number
}

type FieldSettingsFormProps = {
	field: FormField
	formId: number
}

export type { FieldSettingsFormProps, FieldSettingsProps }
