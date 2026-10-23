import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormPage } from '@/entities/form'

import type { UpdateFormPageBody } from '../model/pageSettings.schema'

type UpdateFormPageParams = {
	pageId: number
	body: UpdateFormPageBody
}

const updateFormPage = async (params: UpdateFormPageParams) => {
	const { body, pageId } = params
	const response = await apiAxios.patch<Omit<FormPage, 'fields'>>(
		API_ROUTES.PAGE_ID(pageId),
		body
	)

	return response.data
}

export { updateFormPage }
export type { UpdateFormPageParams }
