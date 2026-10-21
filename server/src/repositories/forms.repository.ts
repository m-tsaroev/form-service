import { database } from '@server/db/database.js'
import type { Field, Form, Page } from '@server/domain/models.js'
import { fieldDefinitionSchema } from '@server/schemas/field.schema.js'
import type {
	CreateFormInput,
	UpdateFormInput
} from '@server/schemas/form.schema.js'

type FormRow = {
	id: number
	title: string
	description: string | null
	slug: string | null
	status: Form['status']
	created_at: string
	updated_at: string
}

type PageRow = {
	id: number
	form_id: number
	title: string | null
	description: string | null
	position: number
}

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

const mapForm = (row: FormRow): Form => ({
	id: row.id,
	title: row.title,
	description: row.description,
	slug: row.slug,
	status: row.status,
	createdAt: row.created_at,
	updatedAt: row.updated_at
})

const mapPage = (row: PageRow): Page => ({
	id: row.id,
	formId: row.form_id,
	title: row.title,
	description: row.description,
	position: row.position
})

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

const create = database.transaction((input: CreateFormInput) => {
	const result = database
		.prepare('INSERT INTO forms (title, description) VALUES (?, ?)')
		.run(input.title, input.description ?? null)
	const formId = Number(result.lastInsertRowid)

	database
		.prepare('INSERT INTO pages (form_id, position) VALUES (?, 0)')
		.run(formId)

	return formId
})

const findAll = () =>
	database
		.prepare<[], FormRow>(
			'SELECT * FROM forms ORDER BY created_at DESC, id DESC'
		)
		.all()
		.map(mapForm)

const findById = (id: number) => {
	const row = database
		.prepare<[number], FormRow>('SELECT * FROM forms WHERE id = ?')
		.get(id)
	return row ? mapForm(row) : null
}

const findPublishedBySlug = (slug: string) => {
	const row = database
		.prepare<[string], FormRow>(
			"SELECT * FROM forms WHERE slug = ? AND status = 'published'"
		)
		.get(slug)

	return row ? mapForm(row) : null
}

const slugExists = (slug: string) => {
	const row = database
		.prepare<[string], { exists: 0 | 1 }>(
			'SELECT EXISTS(SELECT 1 FROM forms WHERE slug = ?) AS `exists`'
		)
		.get(slug)

	return row?.exists === 1
}

const findPages = (formId: number) =>
	database
		.prepare<[number], PageRow>(
			'SELECT * FROM pages WHERE form_id = ? ORDER BY position, id'
		)
		.all(formId)
		.map(mapPage)

const findFields = (formId: number) =>
	database
		.prepare<[number], FieldRow>(
			`SELECT fields.* FROM fields
			 JOIN pages ON pages.id = fields.page_id
			 WHERE pages.form_id = ?
			 ORDER BY pages.position, fields.position, fields.id`
		)
		.all(formId)
		.map(mapField)

const update = (id: number, input: UpdateFormInput) => {
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

	assignments.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
	values.push(id)

	const result = database
		.prepare(`UPDATE forms SET ${assignments.join(', ')} WHERE id = ?`)
		.run(...values)

	return result.changes > 0
}

const publish = (id: number, slug: string) => {
	const result = database
		.prepare(
			`UPDATE forms
			 SET status = 'published',
			     slug = COALESCE(slug, ?),
			     updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
			 WHERE id = ?`
		)
		.run(slug, id)

	return result.changes > 0
}

export const formsRepository = {
	create,
	findAll,
	findById,
	findFields,
	findPages,
	findPublishedBySlug,
	publish,
	slugExists,
	update
}
