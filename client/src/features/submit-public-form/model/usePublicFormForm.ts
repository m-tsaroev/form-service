import { zodResolver } from '@hookform/resolvers/zod'
import type { ApiError } from '@shared/api'
import { useForm } from 'react-hook-form'

import type { FormField } from '@/entities/form'

import { createPublicFormSchema } from './publicForm.schema'
import type {
	AnswerValue,
	PublicFormValues,
	SubmitPublicFormBody
} from './submitPublicForm.types'
import { useSubmitPublicForm } from './useSubmitPublicForm'

const isAnswerValue = (value: unknown): value is AnswerValue =>
	typeof value === 'string' ||
	typeof value === 'number' ||
	(Array.isArray(value) && value.every(item => typeof item === 'string'))

const createDefaultValues = (fields: FormField[]): PublicFormValues => ({
	answers: Object.fromEntries(
		fields.map(field => [String(field.id), field.type === 'checkbox' ? [] : ''])
	)
})

const createBody = (
	fields: FormField[],
	values: PublicFormValues
): SubmitPublicFormBody => ({
	answers: fields.flatMap(field => {
		const value = values.answers[String(field.id)]
		const isEmpty = value === '' || (Array.isArray(value) && value.length === 0)

		return !isEmpty && isAnswerValue(value)
			? [{ fieldId: field.id, value }]
			: []
	})
})

type SubmissionIssue = {
	fieldId: number
	message: string
}

const isSubmissionIssue = (value: unknown): value is SubmissionIssue => {
	if (typeof value !== 'object' || value === null) {
		return false
	}

	return (
		'fieldId' in value &&
		typeof value.fieldId === 'number' &&
		'message' in value &&
		typeof value.message === 'string'
	)
}

const getSubmissionIssues = (error: ApiError) => {
	const details = error.error.details
	return Array.isArray(details) ? details.filter(isSubmissionIssue) : []
}

const usePublicFormForm = (slug: string, fields: FormField[]) => {
	const { error, isPending, isSuccess, submit } = useSubmitPublicForm(slug)
	const form = useForm<PublicFormValues>({
		resolver: zodResolver(createPublicFormSchema(fields)),
		defaultValues: createDefaultValues(fields)
	})

	const handleSubmit = (values: PublicFormValues) => {
		submit(createBody(fields, values), {
			onError: submitError => {
				for (const issue of getSubmissionIssues(submitError)) {
					form.setError(`answers.${issue.fieldId}`, {
						type: 'server',
						message: 'Проверьте значение поля'
					})
				}
			}
		})
	}

	return { error, form, handleSubmit, isPending, isSuccess }
}

export { usePublicFormForm }
