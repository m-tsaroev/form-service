import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormTree } from '@/entities/form'

const publishForm = async (formId: number) => {
	const response = await apiAxios.post<FormTree>(
		API_ROUTES.FORM_PUBLISH(formId)
	)
	return response.data
}

export { publishForm }
