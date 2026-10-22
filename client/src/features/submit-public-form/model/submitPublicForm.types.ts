type AnswerValue = string | number | string[]

type SubmitPublicFormBody = {
	answers: Array<{
		fieldId: number
		value: AnswerValue
	}>
}

type Submission = {
	id: number
	formId: number
	createdAt: string
	answers: Array<{
		id: number
		submissionId: number
		fieldId: number
		value: AnswerValue
	}>
}

type PublicFormValues = {
	answers: Record<string, unknown>
}

export type { AnswerValue, PublicFormValues, Submission, SubmitPublicFormBody }
