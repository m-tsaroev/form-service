import type { FormField } from '@/entities/form'

type FormFieldType = FormField['type']

type CreateFormFieldBody =
	| {
			type: 'text' | 'textarea'
			label: string
			description: null
			required: false
			config: Record<string, never>
	  }
	| {
			type: 'email'
			label: string
			description: null
			required: false
			config: Record<string, never>
	  }
	| {
			type: 'number'
			label: string
			description: null
			required: false
			config: Record<string, never>
	  }
	| {
			type: 'radio' | 'checkbox' | 'select'
			label: string
			description: null
			required: false
			config: { options: [] }
	  }

export type { CreateFormFieldBody, FormFieldType }
