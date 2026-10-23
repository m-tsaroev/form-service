import { database } from '@server/db/database.js'
import type { Page } from '@server/domain/models.js'
import type {
	CreatePageInput,
	UpdatePageInput
} from '@server/schemas/page.schema.js'

type PageRow = {
	id: number
	form_id: number
	title: string | null
	description: string | null
	position: number
}

const mapPage = (row: PageRow): Page => ({
	id: row.id,
	formId: row.form_id,
	title: row.title,
	description: row.description,
	position: row.position
})

const findById = (id: number) => {
	const row = database
		.prepare<[number], PageRow>('SELECT * FROM pages WHERE id = ?')
		.get(id)

	return row ? mapPage(row) : null
}

const create = database.transaction(
	(formId: number, input: CreatePageInput) => {
		const positionRow = database
			.prepare<[number], { position: number }>(
				`SELECT COALESCE(MAX(position), -1) + 1 AS position
				 FROM pages
				 WHERE form_id = ?`
			)
			.get(formId)
		const position = positionRow?.position ?? 0
		const result = database
			.prepare(
				`INSERT INTO pages (form_id, title, description, position)
				 VALUES (?, ?, ?, ?)`
			)
			.run(formId, input.title ?? null, input.description ?? null, position)

		database
			.prepare(
				"UPDATE forms SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?"
			)
			.run(formId)

		return Number(result.lastInsertRowid)
	}
)

const update = database.transaction((id: number, input: UpdatePageInput) => {
	const assignments: string[] = []
	const values: Array<string | null | number> = []

	if (input.title !== undefined) {
		assignments.push('title = ?')
		values.push(input.title)
	}

	if (input.description !== undefined) {
		assignments.push('description = ?')
		values.push(input.description)
	}

	values.push(id)
	const result = database
		.prepare(`UPDATE pages SET ${assignments.join(', ')} WHERE id = ?`)
		.run(...values)

	if (result.changes > 0) {
		database
			.prepare(
				`UPDATE forms
				 SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
				 WHERE id = (SELECT form_id FROM pages WHERE id = ?)`
			)
			.run(id)
	}

	return result.changes > 0
})

export const pagesRepository = { create, findById, update }
