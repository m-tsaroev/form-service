import type { FormField } from '@/entities/form'

import type { FieldSettingsValues } from './fieldSettings.schema'
import type { UpdateFormFieldBody } from './updateFormField.types'

const getFieldSettingsValues = (field: FormField): FieldSettingsValues => {
	const common = {
		type: field.type,
		label: field.label,
		description: field.description ?? '',
		required: field.required,
		placeholder: '',
		minLength: undefined,
		maxLength: undefined,
		min: undefined,
		max: undefined,
		step: undefined,
		minSelected: undefined,
		maxSelected: undefined,
		options: []
	} satisfies FieldSettingsValues

	if (field.type === 'text' || field.type === 'textarea') {
		return {
			...common,
			placeholder: field.config.placeholder ?? '',
			minLength: field.config.minLength,
			maxLength: field.config.maxLength
		}
	}

	if (field.type === 'email') {
		return {
			...common,
			placeholder: field.config.placeholder ?? '',
			maxLength: field.config.maxLength
		}
	}

	if (field.type === 'number') {
		return {
			...common,
			placeholder: field.config.placeholder ?? '',
			min: field.config.min,
			max: field.config.max,
			step: field.config.step
		}
	}

	if (field.type === 'checkbox') {
		return {
			...common,
			options: field.config.options,
			minSelected: field.config.minSelected,
			maxSelected: field.config.maxSelected
		}
	}

	return { ...common, options: field.config.options }
}

const buildDraftField = (
	field: FormField,
	values: FieldSettingsValues
): FormField => {
	const common = {
		id: field.id,
		pageId: field.pageId,
		position: field.position,
		label: values.label,
		description: values.description.trim() || null,
		required: values.required
	}

	if (field.type === 'text' || field.type === 'textarea') {
		return {
			...common,
			type: field.type,
			config: {
				placeholder: values.placeholder.trim() || undefined,
				minLength: values.minLength,
				maxLength: values.maxLength
			}
		}
	}

	if (field.type === 'email') {
		return {
			...common,
			type: field.type,
			config: {
				placeholder: values.placeholder.trim() || undefined,
				maxLength: values.maxLength
			}
		}
	}

	if (field.type === 'number') {
		return {
			...common,
			type: field.type,
			config: {
				placeholder: values.placeholder.trim() || undefined,
				min: values.min,
				max: values.max,
				step: values.step
			}
		}
	}

	if (field.type === 'checkbox') {
		return {
			...common,
			type: field.type,
			config: {
				options: values.options,
				minSelected: values.minSelected,
				maxSelected: values.maxSelected
			}
		}
	}

	return {
		...common,
		type: field.type,
		config: { options: values.options }
	}
}

const getUpdateFormFieldBody = (field: FormField): UpdateFormFieldBody => {
	const common = {
		label: field.label,
		description: field.description,
		required: field.required
	}

	if (field.type === 'text' || field.type === 'textarea') {
		return { ...common, type: field.type, config: field.config }
	}

	if (field.type === 'email') {
		return { ...common, type: field.type, config: field.config }
	}

	if (field.type === 'number') {
		return { ...common, type: field.type, config: field.config }
	}

	if (field.type === 'checkbox') {
		return { ...common, type: field.type, config: field.config }
	}

	return { ...common, type: field.type, config: field.config }
}

export { buildDraftField, getFieldSettingsValues, getUpdateFormFieldBody }
