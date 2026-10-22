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
	slug: z.string().nullable()
})

const fieldSchema = z.object({ id: z.number() })
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
		})

		await context.test('does not expose a draft publicly', async () => {
			const response = await requestJson(
				baseUrl,
				'/api/public/forms/not-published'
			)
			assert.equal(response.status, 404)
		})

		await context.test('deletes a field from a draft form', async () => {
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
		})

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
							{ fieldId: secondFieldId, value: 'online' }
						]
					})
				}
			)
			assert.equal(response.status, 201)
			const submission = submissionSchema.parse(response.body)
			assert.equal(submission.answers.length, 2)

			const submissions = await requestJson(
				baseUrl,
				`/api/forms/${formId}/submissions`
			)
			assert.equal(submissions.status, 200)
			assert.equal(z.array(z.unknown()).parse(submissions.body).length, 1)
		})
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => (error ? reject(error) : resolve()))
		})
		database.close()
		await rm(temporaryDirectory, { recursive: true, force: true })
	}
})
