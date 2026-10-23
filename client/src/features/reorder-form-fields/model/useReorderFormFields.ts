import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FORM_QUERY_KEYS, type FormField, type FormTree } from '@/entities/form'

import { reorderFormFields } from '../api/reorderFormFields'

import type {
	ReorderFormFieldsContext,
	ReorderFormFieldsVariables
} from './reorderFormFields.types'

const reorderFieldsInTree = (
	tree: FormTree,
	pageId: number,
	fieldIds: number[]
): FormTree => ({
	...tree,
	pages: tree.pages.map(page => {
		if (page.id !== pageId) {
			return page
		}

		const fieldsById = new Map(page.fields.map(field => [field.id, field]))
		const fields = fieldIds.flatMap((fieldId, position) => {
			const field = fieldsById.get(fieldId)
			return field ? [{ ...field, position }] : []
		})

		return fields.length === page.fields.length ? { ...page, fields } : page
	})
})

const replacePageFields = (
	tree: FormTree,
	pageId: number,
	fields: FormField[]
): FormTree => ({
	...tree,
	pages: tree.pages.map(page =>
		page.id === pageId ? { ...page, fields } : page
	)
})

const useReorderFormFields = (formId: number) => {
	const queryClient = useQueryClient()

	const mutation = useMutation<
		FormField[],
		ApiError,
		ReorderFormFieldsVariables,
		ReorderFormFieldsContext
	>({
		mutationFn: variables =>
			reorderFormFields(variables.pageId, variables.fieldIds),
		mutationKey: ['reorder-form-fields', formId],
		scope: { id: `reorder-form-fields-${formId}` },
		onMutate: variables => {
			const queryKey = FORM_QUERY_KEYS.detail(formId)
			void queryClient.cancelQueries({ queryKey })
			const previousTree = queryClient.getQueryData<FormTree>(queryKey)

			if (previousTree) {
				queryClient.setQueryData(
					queryKey,
					reorderFieldsInTree(
						previousTree,
						variables.pageId,
						variables.fieldIds
					)
				)
			}

			return { previousTree }
		},
		onError: (_error, _variables, context) => {
			if (context?.previousTree) {
				queryClient.setQueryData(
					FORM_QUERY_KEYS.detail(formId),
					context.previousTree
				)
			}
		},
		onSuccess: (fields, variables) => {
			queryClient.setQueryData<FormTree>(
				FORM_QUERY_KEYS.detail(formId),
				current =>
					current
						? replacePageFields(current, variables.pageId, fields)
						: current
			)
		}
	})

	return {
		...mutation,
		reorderFields: mutation.mutate
	}
}

export { useReorderFormFields }
