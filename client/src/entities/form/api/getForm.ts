import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormTree } from '../model/form.types'

const getForm = async (id: number) => {
	const response = await apiAxios.get<FormTree>(API_ROUTES.FORM_ID(id))
	return response.data
}

export { getForm }
