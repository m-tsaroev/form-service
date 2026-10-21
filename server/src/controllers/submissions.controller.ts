import type { RequestHandler } from 'express'

import { submissionsService } from '@server/services/submissions.service.js'

const create: RequestHandler = (request, response) => {
	response
		.status(201)
		.json(submissionsService.create(String(request.params.slug), request.body))
}

const getAll: RequestHandler = (request, response) => {
	response.json(submissionsService.getAll(Number(request.params.id)))
}

const getById: RequestHandler = (request, response) => {
	response.json(
		submissionsService.getById(
			Number(request.params.id),
			Number(request.params.submissionId)
		)
	)
}

export const submissionsController = { create, getAll, getById }
