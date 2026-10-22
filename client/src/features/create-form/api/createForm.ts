import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormTree } from '@/entities/form'

import type { CreateFormBody } from '../model/createForm.schema'

const createForm = async (body: CreateFormBody): Promise<FormTree> => {
	const response = await apiAxios.post<FormTree>(API_ROUTES.FORMS, body)

	return response.data
}

export { createForm }
