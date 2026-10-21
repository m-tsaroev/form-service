import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

import { HttpError } from '@server/errors/http-error.js'

type RequestSource = 'body' | 'params'

const validate = (source: RequestSource, schema: ZodType) => {
	return (request: Request, _response: Response, next: NextFunction) => {
		const result = schema.safeParse(request[source])

		if (!result.success) {
			next(
				new HttpError(
					400,
					'VALIDATION_ERROR',
					'Request validation failed',
					result.error.issues
				)
			)
			return
		}

		request[source] = result.data
		next()
	}
}

export { validate }
