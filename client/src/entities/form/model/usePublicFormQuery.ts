import type { ApiError } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

import { getPublicForm } from '../api/getPublicForm'

import { FORM_QUERY_KEYS } from './form.query-keys'

const usePublicFormQuery = (slug: string) =>
	useQuery<Awaited<ReturnType<typeof getPublicForm>>, ApiError>({
		queryKey: FORM_QUERY_KEYS.publicDetail(slug),
		queryFn: () => getPublicForm(slug),
		enabled: slug.length > 0,
		retry: false
	})

export { usePublicFormQuery }
