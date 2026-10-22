import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { publishForm } from '../api/publishForm'

const usePublishForm = (formId: number) => {
	const queryClient = useQueryClient()
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<FormTree, ApiError>({
		mutationFn: () => publishForm(formId),
		onMutate: () => {
			startOperation({ type: 'publish' })
		},
		onSuccess: form => {
			queryClient.setQueryData(FORM_QUERY_KEYS.detail(formId), form)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return {
		...mutation,
		publish: mutation.mutate
	}
}

export { usePublishForm }
