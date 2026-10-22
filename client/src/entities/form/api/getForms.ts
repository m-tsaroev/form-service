import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormListItem } from '../model/form.types'

const getForms = async (search: string) => {
	const response = await apiAxios.get<FormListItem[]>(API_ROUTES.FORMS, {
		params: search ? { search } : undefined
	})
	return response.data
}

export { getForms }
