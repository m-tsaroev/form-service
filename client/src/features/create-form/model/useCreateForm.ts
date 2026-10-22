import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { FORM_QUERY_KEYS, type FormTree } from '@/entities/form'

import { createForm } from '../api/createForm'

import type { CreateFormBody } from './createForm.schema'

const useCreateForm = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation<FormTree, ApiError, CreateFormBody>({
		mutationFn: createForm,
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: FORM_QUERY_KEYS.lists()
			})
		}
	})

	return {
		...mutation,
		create: mutation.mutate,
		createAsync: mutation.mutateAsync
	}
}

export { useCreateForm }
