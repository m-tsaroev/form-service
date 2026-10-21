import { Router } from 'express'

import { fieldsController } from '@server/controllers/fields.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import {
	fieldIdParamsSchema,
	updateFieldSchema
} from '@server/schemas/field.schema.js'

const fieldsRouter = Router()

fieldsRouter.patch(
	'/:id',
	validate('params', fieldIdParamsSchema),
	validate('body', updateFieldSchema),
	fieldsController.update
)
fieldsRouter.delete(
	'/:id',
	validate('params', fieldIdParamsSchema),
	fieldsController.remove
)

export { fieldsRouter }
