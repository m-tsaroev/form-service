import type { RequestHandler } from 'express'

import { submissionsService } from '@server/services/submissions.service.js'

const create: RequestHandler = (request, response) => {
	response
		.status(201)
		.json(submissionsService.create(String(request.params.slug), request.body))
}

export const submissionsController = { create }
