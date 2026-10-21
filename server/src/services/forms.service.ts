import { HttpError } from '@server/errors/http-error.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import type {
	CreateFormInput,
	UpdateFormInput
} from '@server/schemas/form.schema.js'

const getById = (id: number) => {
	const form = formsRepository.findById(id)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	const pages = formsRepository.findPages(id)
	const fields = formsRepository.findFields(id)

	return {
		...form,
		pages: pages.map(page => ({
			...page,
			fields: fields.filter(field => field.pageId === page.id)
		}))
	}
}

const create = (input: CreateFormInput) => getById(formsRepository.create(input))

const update = (id: number, input: UpdateFormInput) => {
	if (!formsRepository.update(id, input)) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	return getById(id)
}

export const formsService = {
	create,
	getAll: formsRepository.findAll,
	getById,
	update
}
