import { useQuery } from '@tanstack/react-query'

import { getForm } from '../api/getForm'

import { FORM_QUERY_KEYS } from './form.query-keys'

const useFormQuery = (id: number) =>
	useQuery({
		queryKey: FORM_QUERY_KEYS.detail(id),
		queryFn: () => getForm(id),
		enabled: Number.isInteger(id) && id > 0
	})

export { useFormQuery }
