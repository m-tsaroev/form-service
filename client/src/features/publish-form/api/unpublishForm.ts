import { apiAxios } from '@shared/api'

import { API_ROUTES } from '@/shared/config'

import type { FormTree } from '@/entities/form'

const unpublishForm = async (formId: number) => {
	const { data } = await apiAxios.post<FormTree>(
		API_ROUTES.FORM_UNPUBLISH(formId)
	)

	return data
}

export { unpublishForm }
