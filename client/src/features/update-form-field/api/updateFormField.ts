import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormField } from '@/entities/form'

import type { UpdateFormFieldBody } from '../model/updateFormField.types'

type UpdateFormFieldParams = {
	fieldId: number
	body: UpdateFormFieldBody
}

const updateFormField = async (params: UpdateFormFieldParams) => {
	const { body, fieldId } = params
	const response = await apiAxios.patch<FormField>(
		API_ROUTES.FIELD_ID(fieldId),
		body
	)

	return response.data
}

export { updateFormField }
export type { UpdateFormFieldParams }
