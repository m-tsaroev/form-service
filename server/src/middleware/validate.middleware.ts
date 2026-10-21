import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type RequestSource = 'body' | 'params'

const validate = (source: RequestSource, schema: ZodType) => {
	return (request: Request, response: Response, next: NextFunction) => {
		const result = schema.safeParse(request[source])

		if (!result.success) {
			response.status(400).json({
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Request validation failed',
					details: result.error.issues
				}
			})
			return
		}

		request[source] = result.data
		next()
	}
}

export { validate }
