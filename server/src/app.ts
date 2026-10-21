import path from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'

import {
	apiNotFound,
	errorHandler
} from '@server/middleware/error.middleware.js'
import { fieldsRouter } from '@server/routes/fields.routes.js'
import { formsRouter } from '@server/routes/forms.routes.js'
import { publicFormsRouter } from '@server/routes/public-forms.routes.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const clientDirectory = path.resolve(currentDirectory, '../../client/dist')

const createApp = () => {
	const app = express()

	app.use(express.json())

	app.get('/api/health', (_request, response) => {
		response.json({ status: 'ok' })
	})

	app.use('/api/forms', formsRouter)
	app.use('/api/fields', fieldsRouter)
	app.use('/api/public/forms', publicFormsRouter)
	app.use('/api', apiNotFound)

	app.use(express.static(clientDirectory))

	app.use((request, response, next) => {
		if (request.method !== 'GET' || request.path.startsWith('/api')) {
			next()
			return
		}

		response.sendFile(path.join(clientDirectory, 'index.html'))
	})

	app.use(errorHandler)

	return app
}

export { createApp }
