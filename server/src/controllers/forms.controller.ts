import type { RequestHandler } from 'express'

import { formsService } from '@server/services/forms.service.js'

const create: RequestHandler = (request, response) => {
	response.status(201).json(formsService.create(request.body))
}

const getAll: RequestHandler = (request, response) => {
	const search =
		typeof request.query.search === 'string'
			? request.query.search
			: undefined

	response.json(formsService.getAll(search))
}

const getById: RequestHandler = (request, response) => {
	response.json(formsService.getById(Number(request.params.id)))
}

const update: RequestHandler = (request, response) => {
	response.json(formsService.update(Number(request.params.id), request.body))
}

const remove: RequestHandler = (request, response) => {
	formsService.remove(Number(request.params.id))
	response.status(204).send()
}

const publish: RequestHandler = (request, response) => {
	response.json(formsService.publish(Number(request.params.id)))
}

const unpublish: RequestHandler = (request, response) => {
	response.json(formsService.unpublish(Number(request.params.id)))
}

const getPublicBySlug: RequestHandler = (request, response) => {
	response.json(formsService.getPublicBySlug(String(request.params.slug)))
}

export const formsController = {
	create,
	getAll,
	getById,
	getPublicBySlug,
	publish,
	remove,
	unpublish,
	update
}
