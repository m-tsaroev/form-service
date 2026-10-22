import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { type FormField, useFormEditorStore } from '@/entities/form'

import {
	fieldSettingsSchema,
	type FieldSettingsValues
} from './fieldSettings.schema'
import {
	buildDraftField,
	getFieldSettingsValues,
	getUpdateFormFieldBody
} from './fieldSettings.utils'
import { useUpdateFormField } from './useUpdateFormField'

const useUpdateFormFieldForm = (field: FormField, formId: number) => {
	const confirmedFieldRef = useRef(field)
	const updateSelectedField = useFormEditorStore(
		state => state.updateSelectedField
	)
	const { error, isPending, updateField } = useUpdateFormField(formId)
	const form = useForm<FieldSettingsValues>({
		resolver: zodResolver(fieldSettingsSchema),
		defaultValues: getFieldSettingsValues(field)
	})

	useEffect(() => {
		return form.subscribe({
			formState: { isDirty: true, values: true },
			callback: formState => {
				if (!formState.isDirty) {
					return
				}

				updateSelectedField(
					buildDraftField(confirmedFieldRef.current, formState.values)
				)
			}
		})
	}, [form, updateSelectedField])

	const handleSubmit = (settings: FieldSettingsValues) => {
		const draft = buildDraftField(confirmedFieldRef.current, settings)

		updateField(
			{
				fieldId: field.id,
				body: getUpdateFormFieldBody(draft)
			},
			{
				onSuccess: updatedField => {
					confirmedFieldRef.current = updatedField
					form.reset(getFieldSettingsValues(updatedField))
				}
			}
		)
	}

	return {
		error,
		form,
		handleSubmit,
		isPending
	}
}

export { useUpdateFormFieldForm }
