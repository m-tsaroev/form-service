import { database } from '@server/db/database.js'
import type { Answer, Field, Submission } from '@server/domain/models.js'
import {
	type AnswerInput,
	answerValueSchema
} from '@server/schemas/submission.schema.js'

type SubmissionRow = {
	id: number
	form_id: number
	created_at: string
}

type AnswerDetailsRow = {
	id: number
	submission_id: number
	field_id: number
	value: string
	field_label: string
	field_type: Field['type']
}

const mapSubmission = (row: SubmissionRow): Submission => ({
	id: row.id,
	formId: row.form_id,
	createdAt: row.created_at
})

const create = database.transaction(
	(formId: number, answers: AnswerInput[]) => {
		const submissionResult = database
			.prepare('INSERT INTO submissions (form_id) VALUES (?)')
			.run(formId)
		const submissionId = Number(submissionResult.lastInsertRowid)
		const insertAnswer = database.prepare(
			'INSERT INTO answers (submission_id, field_id, value) VALUES (?, ?, ?)'
		)

		const savedAnswers: Answer[] = answers.map(answer => {
			const result = insertAnswer.run(
				submissionId,
				answer.fieldId,
				JSON.stringify(answer.value)
			)

			return {
				id: Number(result.lastInsertRowid),
				submissionId,
				fieldId: answer.fieldId,
				value: answer.value
			}
		})

		const row = database
			.prepare<[number], SubmissionRow>(
				'SELECT * FROM submissions WHERE id = ?'
			)
			.get(submissionId)

		if (!row) {
			throw new Error('Created submission could not be read')
		}

		return { ...mapSubmission(row), answers: savedAnswers }
	}
)

const findAllByFormId = (formId: number) =>
	database
		.prepare<[number], SubmissionRow>(
			`SELECT * FROM submissions
			 WHERE form_id = ?
			 ORDER BY created_at DESC, id DESC`
		)
		.all(formId)
		.map(mapSubmission)

const findByIdAndFormId = (id: number, formId: number) => {
	const row = database
		.prepare<[number, number], SubmissionRow>(
			'SELECT * FROM submissions WHERE id = ? AND form_id = ?'
		)
		.get(id, formId)

	return row ? mapSubmission(row) : null
}

const findAnswers = (submissionId: number) =>
	database
		.prepare<[number], AnswerDetailsRow>(
			`SELECT answers.*, fields.label AS field_label, fields.type AS field_type
			 FROM answers
			 JOIN fields ON fields.id = answers.field_id
			 WHERE answers.submission_id = ?
			 ORDER BY fields.position, answers.id`
		)
		.all(submissionId)
		.map(row => ({
			id: row.id,
			submissionId: row.submission_id,
			fieldId: row.field_id,
			fieldLabel: row.field_label,
			fieldType: row.field_type,
			value: answerValueSchema.parse(JSON.parse(row.value) as unknown)
		}))

export const submissionsRepository = {
	create,
	findAllByFormId,
	findAnswers,
	findByIdAndFormId
}
