import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { deleteFormField } from '../api/deleteFormField'

const removeFieldFromTree = (tree: FormTree, fieldId: number): FormTree => ({
	...tree,
	pages: tree.pages.map(page => ({
		...page,
		fields: page.fields.filter(field => field.id !== fieldId)
	}))
})

const useDeleteFormField = (formId: number) => {
	const queryClient = useQueryClient()
  
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const markFieldSaved = useFormEditorStore(state => state.markFieldSaved)
	const selectField = useFormEditorStore(state => state.selectField)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<void, ApiError, number>({
		mutationFn: deleteFormField,
		onMutate: fieldId => {
			startOperation({ type: 'delete', fieldId })
		},
		onSuccess: (_, fieldId) => {
			const current = queryClient.getQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId)
			)

			if (current) {
				const currentFields = current.pages.flatMap(page => page.fields)
				const deletedIndex = currentFields.findIndex(
					field => field.id === fieldId
				)
				const nextTree = removeFieldFromTree(current, fieldId)
				const remainingFields = nextTree.pages.flatMap(page => page.fields)
				const selectedField = useFormEditorStore.getState().selectedField

				queryClient.setQueryData(FORM_QUERY_KEYS.detail(formId), nextTree)

				if (selectedField?.id === fieldId) {
					selectField(
						remainingFields[
							Math.min(deletedIndex, remainingFields.length - 1)
						] ?? null
					)
				}
			}

			markFieldSaved(fieldId)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return {
		...mutation,
		deleteField: mutation.mutate
	}
}

export { useDeleteFormField }
