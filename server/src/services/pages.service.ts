import { HttpError } from '@server/errors/http-error.js'
import { fieldsRepository } from '@server/repositories/fields.repository.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import { pagesRepository } from '@server/repositories/pages.repository.js'
import type { ReorderFieldsInput } from '@server/schemas/field.schema.js'
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

const reorderFields = (pageId: number, input: ReorderFieldsInput) => {
	if (!pagesRepository.findById(pageId)) {
		throw new HttpError(404, 'PAGE_NOT_FOUND', 'Form page not found')
	}

	const fields = fieldsRepository.findByPageId(pageId)
	const fieldIds = new Set(fields.map(field => field.id))
	const inputIds = new Set(input.fieldIds)

	if (
		fields.length !== input.fieldIds.length ||
		fieldIds.size !== inputIds.size ||
		input.fieldIds.some(fieldId => !fieldIds.has(fieldId))
	) {
		throw new HttpError(
			400,
			'INVALID_FIELD_ORDER',
			'fieldIds must contain every field from the page exactly once'
		)
	}

	fieldsRepository.reorder(pageId, input.fieldIds)
	return fieldsRepository.findByPageId(pageId)
}

export const pagesService = { create, remove, reorderFields, update }
