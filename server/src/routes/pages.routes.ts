import { Router } from 'express'

import { fieldsController } from '@server/controllers/fields.controller.js'
import { pagesController } from '@server/controllers/pages.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import { fieldDefinitionSchema } from '@server/schemas/field.schema.js'
import {
	pageIdParamsSchema,
	updatePageSchema
} from '@server/schemas/page.schema.js'

const pagesRouter = Router()

pagesRouter.post(
	'/:id/fields',
	validate('params', pageIdParamsSchema),
	validate('body', fieldDefinitionSchema),
	fieldsController.createForPage
)
pagesRouter.patch(
	'/:id',
	validate('params', pageIdParamsSchema),
	validate('body', updatePageSchema),
	pagesController.update
)

export { pagesRouter }
