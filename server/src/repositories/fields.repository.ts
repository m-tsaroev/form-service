import { database } from '@server/db/database.js'
import type { Field } from '@server/domain/models.js'
import {
	type FieldDefinition,
	fieldDefinitionSchema
} from '@server/schemas/field.schema.js'

type FieldRow = {
	id: number
	page_id: number
	type: Field['type']
	label: string
	description: string | null
	required: 0 | 1
	position: number
	config: string
}

const mapField = (row: FieldRow): Field => {
	const definition = fieldDefinitionSchema.parse({
		type: row.type,
		label: row.label,
		description: row.description,
		required: row.required === 1,
		config: JSON.parse(row.config) as unknown
	})

	return {
		...definition,
		id: row.id,
		pageId: row.page_id,
		position: row.position
	}
}

const findById = (id: number) => {
	const row = database
		.prepare<[number], FieldRow>('SELECT * FROM fields WHERE id = ?')
		.get(id)

	return row ? mapField(row) : null
}

const findByPageId = (pageId: number) =>
	database
		.prepare<[number], FieldRow>(
			'SELECT * FROM fields WHERE page_id = ? ORDER BY position, id'
		)
		.all(pageId)
		.map(mapField)

const findFirstPageId = (formId: number) => {
	const row = database
		.prepare<[number], { id: number }>(
			`SELECT id FROM pages
			 WHERE form_id = ?
			 ORDER BY position, id
			 LIMIT 1`
		)
		.get(formId)

	return row?.id ?? null
}

const create = database.transaction(
	(formId: number, pageId: number, input: FieldDefinition) => {
		const positionRow = database
			.prepare<[number], { position: number }>(
				`SELECT COALESCE(MAX(position), -1) + 1 AS position
				 FROM fields
				 WHERE page_id = ?`
			)
			.get(pageId)
		const position = positionRow?.position ?? 0
		const result = database
			.prepare(
				`INSERT INTO fields (
					page_id, type, label, description, required, position, config
				 ) VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.run(
				pageId,
				input.type,
				input.label,
				input.description ?? null,
				input.required ? 1 : 0,
				position,
				JSON.stringify(input.config)
			)

		database
			.prepare(
				"UPDATE forms SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?"
			)
			.run(formId)

		return Number(result.lastInsertRowid)
	}
)

const update = database.transaction((id: number, input: FieldDefinition) => {
	const result = database
		.prepare(
			`UPDATE fields
			 SET type = ?, label = ?, description = ?, required = ?, config = ?
			 WHERE id = ?`
		)
		.run(
			input.type,
			input.label,
			input.description ?? null,
			input.required ? 1 : 0,
			JSON.stringify(input.config),
			id
		)

	if (result.changes > 0) {
		database
			.prepare(
				`UPDATE forms
				 SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
				 WHERE id = (
					SELECT pages.form_id FROM pages
					JOIN fields ON fields.page_id = pages.id
					WHERE fields.id = ?
				 )`
			)
			.run(id)
	}

	return result.changes > 0
})

const remove = database.transaction((id: number) => {
	const formRow = database
		.prepare<[number], { form_id: number }>(
			`SELECT pages.form_id FROM pages
			 JOIN fields ON fields.page_id = pages.id
			 WHERE fields.id = ?`
		)
		.get(id)

	if (!formRow) {
		return false
	}

	database.prepare('DELETE FROM fields WHERE id = ?').run(id)
	database
		.prepare(
			"UPDATE forms SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?"
		)
		.run(formRow.form_id)

	return true
})

const reorder = database.transaction((pageId: number, fieldIds: number[]) => {
	const positionOffset = fieldIds.length

	database
		.prepare('UPDATE fields SET position = position + ? WHERE page_id = ?')
		.run(positionOffset, pageId)

	const updatePosition = database.prepare(
		'UPDATE fields SET position = ? WHERE id = ? AND page_id = ?'
	)

	for (const [position, fieldId] of fieldIds.entries()) {
		updatePosition.run(position, fieldId, pageId)
	}

	database
		.prepare(
			`UPDATE forms
			 SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
			 WHERE id = (SELECT form_id FROM pages WHERE id = ?)`
		)
		.run(pageId)
})

const hasAnswers = (id: number) => {
	const row = database
		.prepare<[number], { exists: 0 | 1 }>(
			'SELECT EXISTS(SELECT 1 FROM answers WHERE field_id = ?) AS `exists`'
		)
		.get(id)

	return row?.exists === 1
}

export const fieldsRepository = {
	create,
	findById,
	findByPageId,
	findFirstPageId,
	hasAnswers,
	remove,
	reorder,
	update
}
