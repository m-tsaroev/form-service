import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormTree } from '../model/form.types'

const getPublicForm = async (slug: string) => {
	const response = await apiAxios.get<FormTree>(API_ROUTES.PUBLIC_FORM(slug))
	return response.data
}

export { getPublicForm }
