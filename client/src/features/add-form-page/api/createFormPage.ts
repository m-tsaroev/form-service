import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormPage } from '@/entities/form'

type CreateFormPageBody = {
	title?: string | null
	description?: string | null
}

const createFormPage = async (formId: number, body: CreateFormPageBody) => {
	const response = await apiAxios.post<Omit<FormPage, 'fields'>>(
		API_ROUTES.FORM_PAGES(formId),
		body
	)

	return response.data
}

export { createFormPage }
export type { CreateFormPageBody }
