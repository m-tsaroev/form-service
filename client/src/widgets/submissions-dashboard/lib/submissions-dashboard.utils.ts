import type { FormField, FormTree } from '@/entities/form'
import type { Submission, SubmissionAnswerValue } from '@/entities/submission'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
})

const getFormFields = (form: FormTree) =>
	form.pages
		.toSorted(
			(firstPage, secondPage) => firstPage.position - secondPage.position
		)
		.flatMap(page =>
			page.fields.toSorted(
				(firstField, secondField) => firstField.position - secondField.position
			)
		)

const getOptionLabel = (field: FormField, optionId: string) => {
	if (
		field.type !== 'radio' &&
		field.type !== 'select' &&
		field.type !== 'checkbox'
	) {
		return optionId
	}

	return (
		field.config.options.find(option => option.id === optionId)?.label ??
		optionId
	)
}

const formatAnswerValue = (
	field: FormField,
	value: SubmissionAnswerValue | undefined
) => {
	if (value === undefined || value === '') {
		return '—'
	}

	if (Array.isArray(value)) {
		return value.length > 0
			? value.map(optionId => getOptionLabel(field, optionId)).join(', ')
			: '—'
	}

	if (typeof value === 'number') {
		return new Intl.NumberFormat('ru-RU').format(value)
	}

	return getOptionLabel(field, value)
}

const formatDate = (value: string) => dateFormatter.format(new Date(value))

const formatDateTime = (value: string) =>
	dateTimeFormatter.format(new Date(value))

const getAnswerLabel = (count: number) => {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'ответов'
	}

	if (lastDigit === 1) {
		return 'ответ'
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'ответа'
	}

	return 'ответов'
}

const getFieldLabel = (count: number) => {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'полей'
	}

	if (lastDigit === 1) {
		return 'поле'
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'поля'
	}

	return 'полей'
}

const getSubmissionValue = (submission: Submission, field: FormField) =>
	formatAnswerValue(
		field,
		submission.answers.find(answer => answer.fieldId === field.id)?.value
	)

const escapeCsvCell = (value: string) => `"${value.replaceAll('"', '""')}"`

const downloadSubmissionsCsv = (
	formTitle: string,
	fields: FormField[],
	submissions: Submission[]
) => {
	const rows = [
		[...fields.map(field => field.label), 'Дата отправки'],
		...submissions.map(submission => [
			...fields.map(field => getSubmissionValue(submission, field)),
			formatDateTime(submission.createdAt)
		])
	]
	const csv = rows
		.map(row => row.map(value => escapeCsvCell(value)).join(';'))
		.join('\n')
	const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')

	link.href = url
	link.download = `${formTitle.trim() || 'form'}-responses.csv`
	link.click()
	URL.revokeObjectURL(url)
}

export {
	downloadSubmissionsCsv,
	formatDate,
	formatDateTime,
	getAnswerLabel,
	getFieldLabel,
	getFormFields,
	getSubmissionValue
}
