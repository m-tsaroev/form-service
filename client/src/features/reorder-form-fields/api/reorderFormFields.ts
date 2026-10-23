import { apiAxios } from '@shared/api'
import { API_ROUTES } from '@shared/config'

import type { FormField } from '@/entities/form'

const reorderFormFields = async (pageId: number, fieldIds: number[]) => {
	const response = await apiAxios.patch<FormField[]>(
		API_ROUTES.PAGE_FIELDS_ORDER(pageId),
		{ fieldIds }
	)

	return response.data
}

export { reorderFormFields }
