import type { RequestHandler } from 'express'

import { formsService } from '@server/services/forms.service.js'

const create: RequestHandler = (request, response) => {
	response.status(201).json(formsService.create(request.body))
}

const getAll: RequestHandler = (_request, response) => {
	response.json(formsService.getAll())
}

const getById: RequestHandler = (request, response) => {
	response.json(formsService.getById(Number(request.params.id)))
}

const update: RequestHandler = (request, response) => {
	response.json(formsService.update(Number(request.params.id), request.body))
}

export const formsController = { create, getAll, getById, update }
