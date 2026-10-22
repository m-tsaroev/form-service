import type { ApiError } from '@shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	FORM_QUERY_KEYS,
	type FormListItem,
	type FormTree,
	useFormEditorStore
} from '@/entities/form'

import { publishForm } from '../api/publishForm'
import { unpublishForm } from '../api/unpublishForm'

type PublicationAction = 'publish' | 'unpublish'

const usePublishForm = (formId: number) => {
	const queryClient = useQueryClient()
	const finishOperation = useFormEditorStore(state => state.finishOperation)
	const startOperation = useFormEditorStore(state => state.startOperation)

	const mutation = useMutation<FormTree, ApiError, PublicationAction>({
		mutationFn: action =>
			action === 'publish' ? publishForm(formId) : unpublishForm(formId),
		onMutate: action => {
			startOperation({ type: action })
		},
		onSuccess: form => {
			queryClient.setQueryData(FORM_QUERY_KEYS.detail(formId), form)
			queryClient.setQueriesData<FormListItem[]>(
				{ queryKey: FORM_QUERY_KEYS.lists() },
				forms =>
					forms?.map(item =>
						item.id === form.id
							? {
									...item,
									description: form.description,
									slug: form.slug,
									status: form.status,
									title: form.title,
									updatedAt: form.updatedAt
								}
							: item
					)
			)
		},
		onSettled: () => {
			finishOperation()
		}
	})

	return {
		...mutation,
		updatePublication: mutation.mutate
	}
}

export { usePublishForm }
