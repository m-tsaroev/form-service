import type { RequestHandler } from 'express'

import { fieldsService } from '@server/services/fields.service.js'

const create: RequestHandler = (request, response) => {
	const field = fieldsService.create(Number(request.params.id), request.body)
	response.status(201).json(field)
}

const update: RequestHandler = (request, response) => {
	response.json(fieldsService.update(Number(request.params.id), request.body))
}

const remove: RequestHandler = (request, response) => {
	fieldsService.remove(Number(request.params.id))
	response.status(204).send()
}

export const fieldsController = { create, remove, update }
