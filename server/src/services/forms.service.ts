import { randomBytes } from 'node:crypto'

import type { Field, Form } from '@server/domain/models.js'
import { HttpError } from '@server/errors/http-error.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import type {
	CreateFormInput,
	UpdateFormInput
} from '@server/schemas/form.schema.js'

const buildFormTree = (form: Form) => {
	const id = form.id
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

const getById = (id: number) => {
	const form = formsRepository.findById(id)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	return buildFormTree(form)
}

const getPublicationIssues = (fields: Field[]) => {
	const issues: Array<{ fieldId: number; message: string }> = []

	for (const field of fields) {
		if (
			(field.type === 'radio' ||
				field.type === 'checkbox' ||
				field.type === 'select') &&
			field.config.options.length === 0
		) {
			issues.push({
				fieldId: field.id,
				message: 'Choice field must contain at least one option'
			})
		}

		if (field.type === 'checkbox') {
			const optionCount = field.config.options.length

			if (
				field.config.minSelected !== undefined &&
				field.config.minSelected > optionCount
			) {
				issues.push({
					fieldId: field.id,
					message: 'minSelected must not exceed the number of options'
				})
			}

			if (
				field.config.maxSelected !== undefined &&
				field.config.maxSelected > optionCount
			) {
				issues.push({
					fieldId: field.id,
					message: 'maxSelected must not exceed the number of options'
				})
			}
		}
	}

	return issues
}

const createSlug = (title: string) => {
	const base =
		title
			.normalize('NFC')
			.toLowerCase()
			.replace(/[^\p{Letter}\p{Number}]+/gu, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 60) || 'form'

	let slug = ''

	do {
		slug = `${base}-${randomBytes(4).toString('hex')}`
	} while (formsRepository.slugExists(slug))

	return slug
}

const create = (input: CreateFormInput) =>
	getById(formsRepository.create(input))

const update = (id: number, input: UpdateFormInput) => {
	if (!formsRepository.update(id, input)) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	return getById(id)
}

const publish = (id: number) => {
	const form = formsRepository.findById(id)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	if (form.status === 'published' && form.slug) {
		return buildFormTree(form)
	}

	const fields = formsRepository.findFields(id)

	if (fields.length === 0) {
		throw new HttpError(
			409,
			'FORM_NOT_READY',
			'Form must contain at least one field'
		)
	}

	const issues = getPublicationIssues(fields)

	if (issues.length > 0) {
		throw new HttpError(
			409,
			'FORM_NOT_READY',
			'Form contains incomplete fields',
			issues
		)
	}

	formsRepository.publish(id, form.slug ?? createSlug(form.title))
	return getById(id)
}

const unpublish = (id: number) => {
	const form = formsRepository.findById(id)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	if (form.status === 'draft') {
		return buildFormTree(form)
	}

	formsRepository.unpublish(id)
	return getById(id)
}

const getPublicBySlug = (slug: string) => {
	const form = formsRepository.findPublishedBySlug(slug)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	return buildFormTree(form)
}

const getAll = (search?: string) => formsRepository.findAll(search)

export const formsService = {
	create,
	getAll,
	getById,
	getPublicBySlug,
	publish,
	unpublish,
	update
}
