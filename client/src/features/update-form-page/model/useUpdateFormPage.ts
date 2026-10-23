import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormPage,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import {
	type UpdateFormPageParams,
	updateFormPage
} from '../api/updateFormPage'

const replacePageInTree = (
	tree: FormTree,
	updatedPage: Omit<FormPage, 'fields'>
): FormTree => ({
	...tree,
	pages: tree.pages.map(page =>
		page.id === updatedPage.id ? { ...page, ...updatedPage } : page
	)
})

const useUpdateFormPage = (formId: number) => {
	const queryClient = useQueryClient()
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<
		Omit<FormPage, 'fields'>,
		ApiError,
		UpdateFormPageParams
	>({
		mutationFn: updateFormPage,
		onMutate: () => {
			startOperation({ type: 'update-page' })
		},
		onSuccess: updatedPage => {
			queryClient.setQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId),
				current => (current ? replacePageInTree(current, updatedPage) : current)
			)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return { ...mutation, updatePage: mutation.mutate }
}

export { useUpdateFormPage }
