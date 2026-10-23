import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormPage,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { createFormPage } from '../api/createFormPage'

const addPageToTree = (
	tree: FormTree,
	page: Omit<FormPage, 'fields'>
): FormTree => ({
	...tree,
	pages: [...tree.pages, { ...page, fields: [] }]
})

const useAddFormPage = (
	formId: number,
	nextPageNumber: number,
	onPageAdded?: (pageId: number) => void
) => {
	const queryClient = useQueryClient()

	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<Omit<FormPage, 'fields'>, ApiError>({
		mutationFn: () =>
			createFormPage(formId, { title: `Страница ${nextPageNumber}` }),
		onMutate: () => {
			startOperation({ type: 'add-page' })
		},
		onSuccess: page => {
			queryClient.setQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId),
				current => (current ? addPageToTree(current, page) : current)
			)
			onPageAdded?.(page.id)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return { ...mutation, addPage: mutation.mutate }
}

export { useAddFormPage }
