import { database } from '@server/db/database.js'
import type { Answer, Submission } from '@server/domain/models.js'
import type { AnswerInput } from '@server/schemas/submission.schema.js'

type SubmissionRow = {
	id: number
	form_id: number
	created_at: string
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

export const submissionsRepository = { create }
