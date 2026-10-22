import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormField } from '@/entities/form'

import type { CreateFormFieldBody } from '../model/addFormField.types'

const createFormField = async (formId: number, body: CreateFormFieldBody) => {
	const response = await apiAxios.post<FormField>(
		API_ROUTES.FORM_FIELDS(formId),
		body
	)

	return response.data
}

export { createFormField }
