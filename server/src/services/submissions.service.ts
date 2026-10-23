import { z } from 'zod'

import type { Field } from '@server/domain/models.js'
import { HttpError } from '@server/errors/http-error.js'
import { formsRepository } from '@server/repositories/forms.repository.js'
import { submissionsRepository } from '@server/repositories/submissions.repository.js'
import type {
	AnswerInput,
	AnswerValue,
	CreateSubmissionInput
} from '@server/schemas/submission.schema.js'

type ValidationIssue = {
	fieldId: number
	message: string
}

const isStepAligned = (value: number, step: number, base: number) => {
	const quotient = (value - base) / step
	return Math.abs(quotient - Math.round(quotient)) < 1e-9
}

const validateValue = (field: Field, value: AnswerValue) => {
	switch (field.type) {
		case 'text':
		case 'textarea': {
			let schema = z.string()

			if (field.config.minLength !== undefined) {
				schema = schema.min(field.config.minLength)
			}

			if (field.config.maxLength !== undefined) {
				schema = schema.max(field.config.maxLength)
			}

			return schema.safeParse(value).success
		}
		case 'email': {
			let schema = z.email()

			if (field.config.maxLength !== undefined) {
				schema = schema.max(field.config.maxLength)
			}

			return schema.safeParse(value).success
		}
		case 'number':
			return (
				typeof value === 'number' &&
				(field.config.min === undefined || value >= field.config.min) &&
				(field.config.max === undefined || value <= field.config.max) &&
				(field.config.step === undefined ||
					isStepAligned(value, field.config.step, field.config.min ?? 0))
			)
		case 'radio':
		case 'select':
			return (
				typeof value === 'string' &&
				field.config.options.some(option => option.id === value)
			)
		case 'checkbox': {
			if (!Array.isArray(value) || new Set(value).size !== value.length) {
				return false
			}

			const optionIds = new Set(field.config.options.map(option => option.id))
			return (
				value.every(optionId => optionIds.has(optionId)) &&
				(field.config.minSelected === undefined ||
					value.length >= field.config.minSelected) &&
				(field.config.maxSelected === undefined ||
					value.length <= field.config.maxSelected)
			)
		}
	}
}

const validateAnswers = (fields: Field[], answers: AnswerInput[]) => {
	const fieldsById = new Map(fields.map(field => [field.id, field]))
	const answersByFieldId = new Map(
		answers.map(answer => [answer.fieldId, answer])
	)
	const issues: ValidationIssue[] = []

	for (const answer of answers) {
		const field = fieldsById.get(answer.fieldId)

		if (!field) {
			issues.push({
				fieldId: answer.fieldId,
				message: 'Field does not belong to this form'
			})
			continue
		}

		if (!validateValue(field, answer.value)) {
			issues.push({
				fieldId: field.id,
				message: 'Answer does not satisfy the field constraints'
			})
		}
	}

	for (const field of fields) {
		const answer = answersByFieldId.get(field.id)
		const isEmpty =
			answer === undefined ||
			answer.value === '' ||
			(Array.isArray(answer.value) && answer.value.length === 0)

		if (field.required && isEmpty) {
			issues.push({ fieldId: field.id, message: 'Field is required' })
		}
	}

	return issues
}

const create = (slug: string, input: CreateSubmissionInput) => {
	const form = formsRepository.findPublishedBySlug(slug)

	if (!form) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}

	const fields = formsRepository.findFields(form.id)
	const issues = validateAnswers(fields, input.answers)

	if (issues.length > 0) {
		throw new HttpError(
			400,
			'INVALID_SUBMISSION',
			'Submission contains invalid answers',
			issues
		)
	}

	return submissionsRepository.create(form.id, input.answers)
}

const ensureFormExists = (formId: number) => {
	if (!formsRepository.findById(formId)) {
		throw new HttpError(404, 'FORM_NOT_FOUND', 'Form not found')
	}
}

const getAll = (formId: number) => {
	ensureFormExists(formId)
	const submissions = submissionsRepository.findAllByFormId(formId)
	const answers = submissionsRepository.findAnswersByFormId(formId)
	const answersBySubmissionId = new Map<number, (typeof answers)[number][]>()

	for (const answer of answers) {
		const submissionAnswers = answersBySubmissionId.get(answer.submissionId)

		if (submissionAnswers) {
			submissionAnswers.push(answer)
		} else {
			answersBySubmissionId.set(answer.submissionId, [answer])
		}
	}

	return submissions.map(submission => ({
		...submission,
		answers: answersBySubmissionId.get(submission.id) ?? []
	}))
}

const getById = (formId: number, submissionId: number) => {
	ensureFormExists(formId)
	const submission = submissionsRepository.findByIdAndFormId(
		submissionId,
		formId
	)

	if (!submission) {
		throw new HttpError(404, 'SUBMISSION_NOT_FOUND', 'Submission not found')
	}

	return {
		...submission,
		answers: submissionsRepository.findAnswers(submissionId)
	}
}

export const submissionsService = { create, getAll, getById }
