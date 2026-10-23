import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

const deleteFormPage = async (pageId: number) => {
	await apiAxios.delete(API_ROUTES.PAGE_ID(pageId))
}

export { deleteFormPage }
