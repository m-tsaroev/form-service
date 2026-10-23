import type { FormField } from '@/entities/form'

type SubmissionAnswerValue = string | number | string[]

type SubmissionAnswer = {
	id: number
	submissionId: number
	fieldId: number
	fieldLabel: string
	fieldType: FormField['type']
	value: SubmissionAnswerValue
}

type Submission = {
	id: number
	formId: number
	createdAt: string
	answers: SubmissionAnswer[]
}

export type { Submission, SubmissionAnswer, SubmissionAnswerValue }
