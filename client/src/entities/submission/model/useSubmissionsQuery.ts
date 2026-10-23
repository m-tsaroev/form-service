import { useQuery } from '@tanstack/react-query'

import { getSubmissions } from '../api/getSubmissions'

import { SUBMISSION_QUERY_KEYS } from './submission.query-keys'

const useSubmissionsQuery = (formId: number) =>
	useQuery({
		queryKey: SUBMISSION_QUERY_KEYS.list(formId),
		queryFn: () => getSubmissions(formId),
		enabled: Number.isInteger(formId) && formId > 0
	})

export { useSubmissionsQuery }
