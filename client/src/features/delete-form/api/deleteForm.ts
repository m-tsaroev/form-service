import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

const deleteForm = async (formId: number) => {
	await apiAxios.delete(API_ROUTES.FORM_ID(formId))
}

export { deleteForm }
