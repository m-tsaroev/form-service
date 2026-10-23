import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { Submission } from '../model/submission.types'

const getSubmissions = async (formId: number) => {
	const response = await apiAxios.get<Submission[]>(
		API_ROUTES.FORM_SUBMISSIONS(formId)
	)

	return response.data
}

export { getSubmissions }
