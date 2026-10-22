import type { FieldDefinition } from '@server/schemas/field.schema.js'
import type { AnswerValue } from '@server/schemas/submission.schema.js'

type FormStatus = 'draft' | 'published'

type Form = {
	id: number
	title: string
	description: string | null
	slug: string | null
	status: FormStatus
	createdAt: string
	updatedAt: string
}

type FormListItem = Form & {
	submissionCount: number
}

type Page = {
	id: number
	formId: number
	title: string | null
	description: string | null
	position: number
}

type Field = FieldDefinition & {
	id: number
	pageId: number
	position: number
}

type Submission = {
	id: number
	formId: number
	createdAt: string
}

type Answer = {
	id: number
	submissionId: number
	fieldId: number
	value: AnswerValue
}

export type { Answer, Field, Form, FormListItem, FormStatus, Page, Submission }
