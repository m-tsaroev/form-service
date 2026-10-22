import type { FormField } from '@/entities/form'

type UpdateFormFieldBody = FormField extends infer Field
	? Field extends FormField
		? Omit<Field, 'id' | 'pageId' | 'position'>
		: never
	: never

export type { UpdateFormFieldBody }
