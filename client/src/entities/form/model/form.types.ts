type FormStatus = 'draft' | 'published'

type FieldOption = {
	id: string
	label: string
}

type FormFieldBase = {
	id: number
	pageId: number
	position: number
	label: string
	description: string | null
	required: boolean
}

type TextConfig = {
	placeholder?: string
	minLength?: number
	maxLength?: number
}

type TextField = FormFieldBase & {
	type: 'text'
	config: TextConfig
}

type TextareaField = FormFieldBase & {
	type: 'textarea'
	config: TextConfig
}

type EmailField = FormFieldBase & {
	type: 'email'
	config: {
		placeholder?: string
		maxLength?: number
	}
}

type NumberField = FormFieldBase & {
	type: 'number'
	config: {
		placeholder?: string
		min?: number
		max?: number
		step?: number
	}
}

type ChoiceField = FormFieldBase & {
	type: 'radio' | 'select'
	config: {
		options: FieldOption[]
	}
}

type CheckboxField = FormFieldBase & {
	type: 'checkbox'
	config: {
		options: FieldOption[]
		minSelected?: number
		maxSelected?: number
	}
}

type FormField =
	| TextField
	| TextareaField
	| EmailField
	| NumberField
	| ChoiceField
	| CheckboxField

type FormPage = {
	id: number
	formId: number
	title: string | null
	description: string | null
	position: number
	fields: FormField[]
}

type Form = {
	id: number
	title: string
	description: string | null
	slug: string | null
	status: FormStatus
	createdAt: string
	updatedAt: string
}

type FormTree = Form & {
	pages: FormPage[]
}

export type { Form, FormField, FormPage, FormStatus, FormTree }
