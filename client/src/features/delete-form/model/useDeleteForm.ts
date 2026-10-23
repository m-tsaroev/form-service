import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FORM_QUERY_KEYS, type FormListItem } from '@/entities/form'

import { deleteForm } from '../api/deleteForm'

const useDeleteForm = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<void, ApiError, number>({
		mutationFn: deleteForm,
		onSuccess: (_, formId) => {
			queryClient.setQueriesData<FormListItem[]>(
				{ queryKey: FORM_QUERY_KEYS.lists() },
				forms => forms?.filter(form => form.id !== formId)
			)
			queryClient.removeQueries({
				queryKey: FORM_QUERY_KEYS.detail(formId),
				exact: true
			})
		}
	})

	return { ...mutation, deleteForm: mutation.mutate }
}

export { useDeleteForm }
