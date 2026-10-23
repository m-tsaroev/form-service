import { HttpError } from '@server/errors/http-error.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import { pagesRepository } from '@server/repositories/pages.repository.js'
import type {
	CreatePageInput,
	UpdatePageInput
} from '@server/schemas/page.schema.js'

const create = (formId: number, input: CreatePageInput) => {
	if (!formsRepository.findById(formId)) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	return pagesRepository.findById(pagesRepository.create(formId, input))
}

const update = (id: number, input: UpdatePageInput) => {
	if (!pagesRepository.update(id, input)) {
		throw new HttpError(404, 'PAGE_NOT_FOUND', 'Form page not found')
	}

	return pagesRepository.findById(id)
}

const remove = (id: number) => {
	const page = pagesRepository.findById(id)

	if (!page) {
		throw new HttpError(404, 'PAGE_NOT_FOUND', 'Form page not found')
	}

	if (pagesRepository.countByFormId(page.formId) === 1) {
		throw new HttpError(
			409,
			'FORM_REQUIRES_PAGE',
			'Form must contain at least one page'
		)
	}

	if (pagesRepository.hasAnswers(id)) {
		throw new HttpError(
			409,
			'PAGE_HAS_ANSWERS',
			'Form page with submitted answers cannot be deleted'
		)
	}

	pagesRepository.remove(id)
}

export const pagesService = { create, remove, update }
