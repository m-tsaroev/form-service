import type { RequestHandler } from 'express'

import { pagesService } from '@server/services/pages.service.js'

const create: RequestHandler = (request, response) => {
	const page = pagesService.create(Number(request.params.id), request.body)
	response.status(201).json(page)
}

const update: RequestHandler = (request, response) => {
	response.json(pagesService.update(Number(request.params.id), request.body))
}

const remove: RequestHandler = (request, response) => {
	pagesService.remove(Number(request.params.id))
	response.status(204).send()
}

export const pagesController = { create, remove, update }
