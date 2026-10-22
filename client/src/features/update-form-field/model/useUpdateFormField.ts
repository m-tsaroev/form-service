import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormField,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import {
	type UpdateFormFieldParams,
	updateFormField
} from '../api/updateFormField'

const replaceFieldInTree = (tree: FormTree, updatedField: FormField): FormTree => ({
	...tree,
	pages: tree.pages.map(page => ({
		...page,
		fields: page.fields.map(field =>
			field.id === updatedField.id ? updatedField : field
		)
	}))
})

const useUpdateFormField = (formId: number) => {
	const queryClient = useQueryClient()
  
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const markFieldSaved = useFormEditorStore(state => state.markFieldSaved)
	const selectField = useFormEditorStore(state => state.selectField)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<FormField, ApiError, UpdateFormFieldParams>({
		mutationFn: updateFormField,
		onMutate: variables => {
			startOperation({ type: 'update', fieldId: variables.fieldId })
		},
		onSuccess: updatedField => {
			queryClient.setQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId),
				current =>
					current ? replaceFieldInTree(current, updatedField) : current
			)
			markFieldSaved(updatedField.id)
			selectField(updatedField)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return {
		...mutation,
		updateField: mutation.mutate
	}
}

export { useUpdateFormField }
