import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { z } from 'zod'

const formSchema = z.object({
	id: z.number(),
	title: z.string(),
	slug: z.string().nullable(),
	status: z.enum(['draft', 'published'])
})
const formListItemSchema = formSchema.extend({ submissionCount: z.number() })

const fieldSchema = z.object({ id: z.number() })
const pageSchema = z.object({
	id: z.number(),
	formId: z.number(),
	title: z.string().nullable(),
	description: z.string().nullable(),
	position: z.number()
})
const updatedFieldSchema = fieldSchema.extend({
	label: z.string(),
	config: z.object({ placeholder: z.string().optional() })
})
const formTreeSchema = z.object({
	pages: z.array(z.object({ fields: z.array(fieldSchema) }))
})
const submissionSchema = z.object({
	id: z.number(),
	answers: z.array(z.object({ fieldId: z.number(), value: z.unknown() }))
})

const requestJson = async (
	baseUrl: string,
	pathname: string,
	init?: RequestInit
) => {
	const response = await fetch(`${baseUrl}${pathname}`, {
		...init,
		headers: { 'Content-Type': 'application/json', ...init?.headers }
	})
	const body = (await response.json()) as unknown

	return { body, status: response.status }
}

test('form submission API persists only valid submissions', async context => {
	const temporaryDirectory = await mkdtemp(
		path.join(tmpdir(), 'form-service-test-')
	)
	process.env.DATABASE_PATH = path.join(temporaryDirectory, 'test.db')

	const { database } = await import('@server/db/database.js')
	const { runMigrations } = await import('@server/db/migrate.js')
	const { createApp } = await import('@server/app.js')

	runMigrations()
	const server = createApp().listen(0)
	await new Promise<void>(resolve => server.once('listening', resolve))
	const address = server.address() as AddressInfo
	const baseUrl = `http://127.0.0.1:${address.port}`

	try {
		let formId = 0
		let secondPageId = 0
		let secondPageFieldId = 0
		let firstFieldId = 0
		let secondFieldId = 0
		let slug = ''

		await context.test('creates and reads a form', async () => {
			const created = await requestJson(baseUrl, '/api/forms', {
				method: 'POST',
				body: JSON.stringify({ title: 'Application' })
			})
			assert.equal(created.status, 201)
			const form = formSchema.parse(created.body)
			formId = form.id

			const read = await requestJson(baseUrl, `/api/forms/${formId}`)
			assert.equal(read.status, 200)
			assert.equal(formSchema.parse(read.body).title, 'Application')

			const list = await requestJson(baseUrl, '/api/forms')
			assert.equal(list.status, 200)
			assert.equal(
				z.array(formListItemSchema).parse(list.body)[0]?.submissionCount,
				0
			)

			const matchingList = await requestJson(baseUrl, '/api/forms?search=app')
			assert.equal(
				z.array(formListItemSchema).parse(matchingList.body).length,
				1
			)

			const emptyList = await requestJson(baseUrl, '/api/forms?search=missing')
			assert.equal(z.array(formListItemSchema).parse(emptyList.body).length, 0)

			const escapedWildcard = await requestJson(
				baseUrl,
				'/api/forms?search=%25'
			)
			assert.equal(
				z.array(formListItemSchema).parse(escapedWildcard.body).length,
				0
			)

			const invalidQuery = await requestJson(
				baseUrl,
				'/api/forms?unknown=value'
			)
			assert.equal(invalidQuery.status, 400)
		})

		await context.test('does not expose a draft publicly', async () => {
			const response = await requestJson(
				baseUrl,
				'/api/public/forms/not-published'
			)
			assert.equal(response.status, 404)
		})

		await context.test('creates, updates and targets a form page', async () => {
			const created = await requestJson(baseUrl, `/api/forms/${formId}/pages`, {
				method: 'POST',
				body: JSON.stringify({ title: 'Details' })
			})
			assert.equal(created.status, 201)
			const page = pageSchema.parse(created.body)
			secondPageId = page.id
			assert.equal(page.formId, formId)
			assert.equal(page.position, 1)

			const updated = await requestJson(baseUrl, `/api/pages/${secondPageId}`, {
				method: 'PATCH',
				body: JSON.stringify({
					title: 'Contact details',
					description: 'How can we reach you?'
				})
			})
			assert.equal(updated.status, 200)
			assert.equal(pageSchema.parse(updated.body).title, 'Contact details')

			const fieldResponse = await requestJson(
				baseUrl,
				`/api/pages/${secondPageId}/fields`,
				{
					method: 'POST',
					body: JSON.stringify({
						type: 'email',
						label: 'Contact email',
						config: {}
					})
				}
			)
			assert.equal(fieldResponse.status, 201)
			const field = z
				.object({ id: z.number(), pageId: z.number() })
				.parse(fieldResponse.body)
			secondPageFieldId = field.id
			assert.equal(field.pageId, secondPageId)

			const read = await requestJson(baseUrl, `/api/forms/${formId}`)
			const tree = z
				.object({
					pages: z.array(
						pageSchema.extend({ fields: z.array(z.object({ id: z.number() })) })
					)
				})
				.parse(read.body)
			assert.equal(tree.pages.length, 2)
			assert.equal(
				tree.pages.find(item => item.id === secondPageId)?.fields[0]?.id,
				field.id
			)

			const emptyUpdate = await requestJson(
				baseUrl,
				`/api/pages/${secondPageId}`,
				{ method: 'PATCH', body: JSON.stringify({}) }
			)
			assert.equal(emptyUpdate.status, 400)

			const missingForm = await requestJson(
				baseUrl,
				'/api/forms/999999/pages',
				{ method: 'POST', body: JSON.stringify({}) }
			)
			assert.equal(missingForm.status, 404)

			const missingPage = await requestJson(
				baseUrl,
				'/api/pages/999999/fields',
				{
					method: 'POST',
					body: JSON.stringify({
						type: 'text',
						label: 'Missing page field',
						config: {}
					})
				}
			)
			assert.equal(missingPage.status, 404)
		})

		await context.test(
			'deletes a page, its fields and normalizes positions',
			async () => {
				const created = await requestJson(baseUrl, '/api/forms', {
					method: 'POST',
					body: JSON.stringify({ title: 'Page deletion form' })
				})
				assert.equal(created.status, 201)
				const disposableForm = z
					.object({
						id: z.number(),
						pages: z.array(pageSchema)
					})
					.parse(created.body)
				const firstPageId = disposableForm.pages[0]?.id
				assert.ok(firstPageId)

				const secondPageResponse = await requestJson(
					baseUrl,
					`/api/forms/${disposableForm.id}/pages`,
					{ method: 'POST', body: JSON.stringify({ title: 'Second' }) }
				)
				const secondPage = pageSchema.parse(secondPageResponse.body)
				const thirdPageResponse = await requestJson(
					baseUrl,
					`/api/forms/${disposableForm.id}/pages`,
					{ method: 'POST', body: JSON.stringify({ title: 'Third' }) }
				)
				const thirdPage = pageSchema.parse(thirdPageResponse.body)

				const fieldResponse = await requestJson(
					baseUrl,
					`/api/pages/${secondPage.id}/fields`,
					{
						method: 'POST',
						body: JSON.stringify({
							type: 'text',
							label: 'Disposable page field',
							config: {}
						})
					}
				)
				const fieldId = fieldSchema.parse(fieldResponse.body).id

				const removed = await fetch(`${baseUrl}/api/pages/${secondPage.id}`, {
					method: 'DELETE'
				})
				assert.equal(removed.status, 204)

				const read = await requestJson(
					baseUrl,
					`/api/forms/${disposableForm.id}`
				)
				const form = z.object({ pages: z.array(pageSchema) }).parse(read.body)
				assert.deepEqual(
					form.pages.map(page => ({ id: page.id, position: page.position })),
					[
						{ id: firstPageId, position: 0 },
						{ id: thirdPage.id, position: 1 }
					]
				)

				const fieldCount = database
					.prepare<[number], { count: number }>(
						'SELECT COUNT(*) AS count FROM fields WHERE id = ?'
					)
					.get(fieldId)
				assert.equal(fieldCount?.count, 0)

				const removedThirdPage = await fetch(
					`${baseUrl}/api/pages/${thirdPage.id}`,
					{ method: 'DELETE' }
				)
				assert.equal(removedThirdPage.status, 204)

				const lastPage = await requestJson(
					baseUrl,
					`/api/pages/${firstPageId}`,
					{ method: 'DELETE' }
				)
				assert.equal(lastPage.status, 409)
				assert.equal(
					z
						.object({ error: z.object({ code: z.string() }) })
						.parse(lastPage.body).error.code,
					'FORM_REQUIRES_PAGE'
				)

				const missingPage = await requestJson(baseUrl, '/api/pages/999999', {
					method: 'DELETE'
				})
				assert.equal(missingPage.status, 404)

				const removedForm = await fetch(
					`${baseUrl}/api/forms/${disposableForm.id}`,
					{ method: 'DELETE' }
				)
				assert.equal(removedForm.status, 204)
			}
		)

		await context.test('reorders fields within a page', async () => {
			const created = await requestJson(baseUrl, '/api/forms', {
				method: 'POST',
				body: JSON.stringify({ title: 'Field order form' })
			})
			assert.equal(created.status, 201)
			const form = z
				.object({
					id: z.number(),
					pages: z.array(z.object({ id: z.number() }))
				})
				.parse(created.body)
			const pageId = form.pages[0]?.id
			assert.ok(pageId)

			const fieldIds: number[] = []
			for (const label of ['First', 'Second', 'Third']) {
				const response = await requestJson(
					baseUrl,
					`/api/pages/${pageId}/fields`,
					{
						method: 'POST',
						body: JSON.stringify({ type: 'text', label, config: {} })
					}
				)
				fieldIds.push(fieldSchema.parse(response.body).id)
			}

			const reorderedIds = [fieldIds[2], fieldIds[0], fieldIds[1]]
			const reordered = await requestJson(
				baseUrl,
				`/api/pages/${pageId}/fields/order`,
				{
					method: 'PATCH',
					body: JSON.stringify({ fieldIds: reorderedIds })
				}
			)
			assert.equal(reordered.status, 200)
			assert.deepEqual(
				z
					.array(z.object({ id: z.number(), position: z.number() }))
					.parse(reordered.body)
					.map(field => ({ id: field.id, position: field.position })),
				reorderedIds.map((id, position) => ({ id, position }))
			)

			const duplicate = await requestJson(
				baseUrl,
				`/api/pages/${pageId}/fields/order`,
				{
					method: 'PATCH',
					body: JSON.stringify({
						fieldIds: [fieldIds[0], fieldIds[0], fieldIds[1]]
					})
				}
			)
			assert.equal(duplicate.status, 400)

			const missing = await requestJson(
				baseUrl,
				`/api/pages/${pageId}/fields/order`,
				{
					method: 'PATCH',
					body: JSON.stringify({ fieldIds: [fieldIds[0], fieldIds[1]] })
				}
			)
			assert.equal(missing.status, 400)
			assert.equal(
				z.object({ error: z.object({ code: z.string() }) }).parse(missing.body)
					.error.code,
				'INVALID_FIELD_ORDER'
			)

			const read = await requestJson(baseUrl, `/api/forms/${form.id}`)
			const readFields = z
				.object({
					pages: z.array(
						z.object({
							fields: z.array(
								z.object({ id: z.number(), position: z.number() })
							)
						})
					)
				})
				.parse(read.body)
			assert.deepEqual(
				readFields.pages[0]?.fields.map(field => field.id),
				reorderedIds
			)

			const removedForm = await fetch(`${baseUrl}/api/forms/${form.id}`, {
				method: 'DELETE'
			})
			assert.equal(removedForm.status, 204)
		})

		await context.test(
			'deletes a form without submissions and its structure',
			async () => {
				const created = await requestJson(baseUrl, '/api/forms', {
					method: 'POST',
					body: JSON.stringify({ title: 'Disposable form' })
				})
				assert.equal(created.status, 201)
				const disposableForm = z
					.object({
						id: z.number(),
						pages: z.array(z.object({ id: z.number() }))
					})
					.parse(created.body)
				const disposablePageId = disposableForm.pages[0]?.id
				assert.ok(disposablePageId)

				const fieldResponse = await requestJson(
					baseUrl,
					`/api/pages/${disposablePageId}/fields`,
					{
						method: 'POST',
						body: JSON.stringify({
							type: 'text',
							label: 'Disposable field',
							config: {}
						})
					}
				)
				assert.equal(fieldResponse.status, 201)
				const disposableFieldId = fieldSchema.parse(fieldResponse.body).id

				const removed = await fetch(
					`${baseUrl}/api/forms/${disposableForm.id}`,
					{ method: 'DELETE' }
				)
				assert.equal(removed.status, 204)

				const formCount = database
					.prepare<[number], { count: number }>(
						'SELECT COUNT(*) AS count FROM forms WHERE id = ?'
					)
					.get(disposableForm.id)
				const pageCount = database
					.prepare<[number], { count: number }>(
						'SELECT COUNT(*) AS count FROM pages WHERE id = ?'
					)
					.get(disposablePageId)
				const fieldCount = database
					.prepare<[number], { count: number }>(
						'SELECT COUNT(*) AS count FROM fields WHERE id = ?'
					)
					.get(disposableFieldId)
				assert.equal(formCount?.count, 0)
				assert.equal(pageCount?.count, 0)
				assert.equal(fieldCount?.count, 0)

				const missing = await requestJson(
					baseUrl,
					`/api/forms/${disposableForm.id}`,
					{ method: 'DELETE' }
				)
				assert.equal(missing.status, 404)
			}
		)

		await context.test(
			'updates and deletes a field from a draft form',
			async () => {
				const created = await requestJson(
					baseUrl,
					`/api/forms/${formId}/fields`,
					{
						method: 'POST',
						body: JSON.stringify({
							type: 'text',
							label: 'Temporary field',
							config: {}
						})
					}
				)
				assert.equal(created.status, 201)
				const fieldId = fieldSchema.parse(created.body).id

				const updated = await requestJson(baseUrl, `/api/fields/${fieldId}`, {
					method: 'PATCH',
					body: JSON.stringify({
						label: 'Updated field',
						config: { placeholder: 'Updated placeholder' }
					})
				})
				assert.equal(updated.status, 200)
				assert.deepEqual(updatedFieldSchema.parse(updated.body), {
					id: fieldId,
					label: 'Updated field',
					config: { placeholder: 'Updated placeholder' }
				})

				const removed = await fetch(`${baseUrl}/api/fields/${fieldId}`, {
					method: 'DELETE'
				})
				assert.equal(removed.status, 204)

				const read = await requestJson(baseUrl, `/api/forms/${formId}`)
				const form = formTreeSchema.parse(read.body)
				assert.equal(
					form.pages.some(page =>
						page.fields.some(field => field.id === fieldId)
					),
					false
				)
			}
		)

		await context.test('prepares and publishes the form', async () => {
			const firstField = await requestJson(
				baseUrl,
				`/api/forms/${formId}/fields`,
				{
					method: 'POST',
					body: JSON.stringify({
						type: 'text',
						label: 'Name',
						required: true,
						config: { minLength: 2 }
					})
				}
			)
			assert.equal(firstField.status, 201)
			firstFieldId = fieldSchema.parse(firstField.body).id

			const secondField = await requestJson(
				baseUrl,
				`/api/forms/${formId}/fields`,
				{
					method: 'POST',
					body: JSON.stringify({
						type: 'select',
						label: 'Format',
						required: true,
						config: {
							options: [{ id: 'online', label: 'Online' }]
						}
					})
				}
			)
			assert.equal(secondField.status, 201)
			secondFieldId = fieldSchema.parse(secondField.body).id

			const published = await requestJson(
				baseUrl,
				`/api/forms/${formId}/publish`,
				{ method: 'POST' }
			)
			assert.equal(published.status, 200)
			slug = formSchema.parse(published.body).slug ?? ''
			assert.notEqual(slug, '')
		})

		await context.test(
			'unpublishes the form and preserves its public slug',
			async () => {
				const unpublished = await requestJson(
					baseUrl,
					`/api/forms/${formId}/unpublish`,
					{ method: 'POST' }
				)
				assert.equal(unpublished.status, 200)
				const draft = formSchema.parse(unpublished.body)
				assert.equal(draft.status, 'draft')
				assert.equal(draft.slug, slug)

				const unavailable = await requestJson(
					baseUrl,
					`/api/public/forms/${slug}`
				)
				assert.equal(unavailable.status, 404)

				const republished = await requestJson(
					baseUrl,
					`/api/forms/${formId}/publish`,
					{ method: 'POST' }
				)
				assert.equal(republished.status, 200)
				const published = formSchema.parse(republished.body)
				assert.equal(published.status, 'published')
				assert.equal(published.slug, slug)
			}
		)

		await context.test(
			'invalid submission leaves no partial records',
			async () => {
				const response = await requestJson(
					baseUrl,
					`/api/public/forms/${slug}/submissions`,
					{
						method: 'POST',
						body: JSON.stringify({
							answers: [{ fieldId: firstFieldId, value: 'Ada' }]
						})
					}
				)
				assert.equal(response.status, 400)

				const submissionCount = database
					.prepare<[], { count: number }>(
						'SELECT COUNT(*) AS count FROM submissions'
					)
					.get()
				const answerCount = database
					.prepare<[], { count: number }>(
						'SELECT COUNT(*) AS count FROM answers'
					)
					.get()
				assert.equal(submissionCount?.count, 0)
				assert.equal(answerCount?.count, 0)
			}
		)

		await context.test('saves a valid submission and its answers', async () => {
			const response = await requestJson(
				baseUrl,
				`/api/public/forms/${slug}/submissions`,
				{
					method: 'POST',
					body: JSON.stringify({
						answers: [
							{ fieldId: firstFieldId, value: 'Ada' },
							{ fieldId: secondFieldId, value: 'online' },
							{ fieldId: secondPageFieldId, value: 'ada@example.com' }
						]
					})
				}
			)
			assert.equal(response.status, 201)
			const submission = submissionSchema.parse(response.body)
			assert.equal(submission.answers.length, 3)

			const submissions = await requestJson(
				baseUrl,
				`/api/forms/${formId}/submissions`
			)
			assert.equal(submissions.status, 200)
			const savedSubmissions = z.array(submissionSchema).parse(submissions.body)
			assert.equal(savedSubmissions.length, 1)
			assert.deepEqual(
				savedSubmissions[0]?.answers
					.map(answer => answer.fieldId)
					.toSorted((left, right) => left - right),
				[firstFieldId, secondFieldId, secondPageFieldId].toSorted(
					(left, right) => left - right
				)
			)

			const list = await requestJson(baseUrl, '/api/forms')
			assert.equal(
				z.array(formListItemSchema).parse(list.body)[0]?.submissionCount,
				1
			)
		})

		await context.test('preserves a page with submitted answers', async () => {
			const response = await requestJson(
				baseUrl,
				`/api/pages/${secondPageId}`,
				{ method: 'DELETE' }
			)
			assert.equal(response.status, 409)
			assert.equal(
				z.object({ error: z.object({ code: z.string() }) }).parse(response.body)
					.error.code,
				'PAGE_HAS_ANSWERS'
			)

			const read = await requestJson(baseUrl, `/api/forms/${formId}`)
			const form = z.object({ pages: z.array(pageSchema) }).parse(read.body)
			assert.equal(
				form.pages.some(page => page.id === secondPageId),
				true
			)
		})

		await context.test('preserves a form with submissions', async () => {
			const response = await requestJson(baseUrl, `/api/forms/${formId}`, {
				method: 'DELETE'
			})
			assert.equal(response.status, 409)
			assert.equal(
				z.object({ error: z.object({ code: z.string() }) }).parse(response.body)
					.error.code,
				'FORM_HAS_SUBMISSIONS'
			)

			const read = await requestJson(baseUrl, `/api/forms/${formId}`)
			assert.equal(read.status, 200)
		})
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => (error ? reject(error) : resolve()))
		})
		database.close()
		await rm(temporaryDirectory, { recursive: true, force: true })
	}
})
