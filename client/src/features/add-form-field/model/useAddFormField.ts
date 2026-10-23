import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormField,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { createFormField } from '../api/createFormField'

import type { CreateFormFieldBody, FormFieldType } from './addFormField.types'

const FIELD_LABELS: Record<FormFieldType, string> = {
	text: 'Текстовое поле',
	textarea: 'Абзац',
	email: 'Электронная почта',
	number: 'Число',
	radio: 'Один вариант',
	checkbox: 'Несколько вариантов',
	select: 'Выпадающий список'
}

const getCreateBody = (type: FormFieldType): CreateFormFieldBody => {
	const common = {
		label: FIELD_LABELS[type],
		description: null,
		required: false
	} as const

	if (type === 'radio' || type === 'checkbox' || type === 'select') {
		return { ...common, type, config: { options: [] } }
	}

	return { ...common, type, config: {} }
}

const addFieldToTree = (tree: FormTree, field: FormField): FormTree => ({
	...tree,
	pages: tree.pages.map(page =>
		page.id === field.pageId
			? { ...page, fields: [...page.fields, field] }
			: page
	)
})

const useAddFormField = (
	formId: number,
	pageId: number,
	onFieldAdded?: (fieldId: number) => void
) => {
	const queryClient = useQueryClient()

	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const selectField = useFormEditorStore(state => state.selectField)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<FormField, ApiError, FormFieldType>({
		mutationFn: type => createFormField(pageId, getCreateBody(type)),
		onMutate: () => {
			startOperation({ type: 'add' })
		},
		onSuccess: field => {
			queryClient.setQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId),
				current => (current ? addFieldToTree(current, field) : current)
			)
			selectField(field)
			onFieldAdded?.(field.id)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return {
		...mutation,
		addField: mutation.mutate,
		addingType: mutation.variables
	}
}

export { useAddFormField }
