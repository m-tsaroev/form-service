import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

const deleteFormField = async (fieldId: number) => {
	await apiAxios.delete(API_ROUTES.FIELD_ID(fieldId))
}

export { deleteFormField }
