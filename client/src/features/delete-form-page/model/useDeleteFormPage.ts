import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { deleteFormPage } from '../api/deleteFormPage'

const removePageFromTree = (tree: FormTree, pageId: number): FormTree => ({
	...tree,
	pages: tree.pages
		.filter(page => page.id !== pageId)
		.map((page, position) => ({ ...page, position }))
})

const useDeleteFormPage = (
	formId: number,
	onPageDeleted: (pageId: number) => void
) => {
	const queryClient = useQueryClient()
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const markFieldSaved = useFormEditorStore(state => state.markFieldSaved)
	const selectField = useFormEditorStore(state => state.selectField)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<void, ApiError, number>({
		mutationFn: deleteFormPage,
		onMutate: () => {
			startOperation({ type: 'delete-page' })
		},
		onSuccess: (_, pageId) => {
			const current = queryClient.getQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId)
			)

			if (!current) {
				return
			}

			const deletedIndex = current.pages.findIndex(page => page.id === pageId)
			const deletedPage = current.pages[deletedIndex]
			const nextTree = removePageFromTree(current, pageId)
			const nextPage =
				nextTree.pages[Math.min(deletedIndex, nextTree.pages.length - 1)]

			queryClient.setQueryData(FORM_QUERY_KEYS.detail(formId), nextTree)
			deletedPage?.fields.forEach(field => markFieldSaved(field.id))
			selectField(null)

			if (nextPage) {
				onPageDeleted(nextPage.id)
			}
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return { ...mutation, deletePage: mutation.mutate }
}

export { useDeleteFormPage }
