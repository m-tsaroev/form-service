import { HttpError } from '@server/errors/http-error.js'
import { fieldsRepository } from '@server/repositories/fields.repository.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import {
	type FieldDefinition,
	type UpdateFieldInput,
	fieldDefinitionSchema
} from '@server/schemas/field.schema.js'

const create = (formId: number, input: FieldDefinition) => {
	if (!formsRepository.findById(formId)) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	const pageId = fieldsRepository.findFirstPageId(formId)

	if (pageId === null) {
		throw new HttpError(404, 'PAGE_NOT_FOUND', 'Form page not found')
	}

	const fieldId = fieldsRepository.create(formId, pageId, input)
	return fieldsRepository.findById(fieldId)
}

const update = (id: number, input: UpdateFieldInput) => {
	const currentField = fieldsRepository.findById(id)

	if (!currentField) {
		throw new HttpError(404, 'FIELD_NOT_FOUND', 'Field not found')
	}

	if (fieldsRepository.hasAnswers(id)) {
		throw new HttpError(
			409,
			'FIELD_HAS_ANSWERS',
			'Field with submitted answers cannot be changed'
		)
	}

	const result = fieldDefinitionSchema.safeParse({
		type: input.type ?? currentField.type,
		label: input.label ?? currentField.label,
		description:
			input.description === undefined
				? currentField.description
				: input.description,
		required: input.required ?? currentField.required,
		config: input.config === undefined ? currentField.config : input.config
	})

	if (!result.success) {
		throw new HttpError(
			400,
			'VALIDATION_ERROR',
			'Request validation failed',
			result.error.issues
		)
	}

	fieldsRepository.update(id, result.data)
	return fieldsRepository.findById(id)
}

const remove = (id: number) => {
	if (!fieldsRepository.findById(id)) {
		throw new HttpError(404, 'FIELD_NOT_FOUND', 'Field not found')
	}

	if (fieldsRepository.hasAnswers(id)) {
		throw new HttpError(
			409,
			'FIELD_HAS_ANSWERS',
			'Field with submitted answers cannot be deleted'
		)
	}

	fieldsRepository.remove(id)
}

export const fieldsService = { create, remove, update }
