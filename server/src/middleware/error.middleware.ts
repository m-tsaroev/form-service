import type { ErrorRequestHandler, RequestHandler } from 'express'

import { HttpError } from '@server/errors/http-error.js'

const apiNotFound: RequestHandler = (_request, _response, next) => {
	next(new HttpError(404, 'ROUTE_NOT_FOUND', 'API route not found'))
}

const errorHandler: ErrorRequestHandler = (
	error,
	_request,
	response,
	_next
) => {
	void _next

	if (error instanceof HttpError) {
		response.status(error.status).json({
			error: {
				code: error.code,
				message: error.message,
				...(error.details === undefined ? {} : { details: error.details })
			}
		})
		return
	}

	if (error instanceof SyntaxError && 'body' in error) {
		response.status(400).json({
			error: {
				code: 'INVALID_JSON',
				message: 'Request body contains invalid JSON'
			}
		})
		return
	}

	console.error(error)
	response.status(500).json({
		error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
	})
}

export { apiNotFound, errorHandler }
