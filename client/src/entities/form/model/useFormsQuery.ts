import type { ApiError } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

import { getForms } from '../api/getForms'

import { FORM_QUERY_KEYS } from './form.query-keys'

const useFormsQuery = (search: string) =>
	useQuery<Awaited<ReturnType<typeof getForms>>, ApiError>({
		queryKey: FORM_QUERY_KEYS.list(search),
		queryFn: () => getForms(search)
	})

export { useFormsQuery }
