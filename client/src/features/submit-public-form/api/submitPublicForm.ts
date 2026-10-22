import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type {
	Submission,
	SubmitPublicFormBody
} from '../model/submitPublicForm.types'

const submitPublicForm = async (slug: string, body: SubmitPublicFormBody) => {
	const response = await apiAxios.post<Submission>(
		API_ROUTES.PUBLIC_FORM_SUBMISSIONS(slug),
		body
	)

	return response.data
}

export { submitPublicForm }
