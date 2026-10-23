import { Router } from 'express'

import { fieldsController } from '@server/controllers/fields.controller.js'
import { pagesController } from '@server/controllers/pages.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import {
	fieldDefinitionSchema,
	reorderFieldsSchema
} from '@server/schemas/field.schema.js'
import {
	pageIdParamsSchema,
	updatePageSchema
} from '@server/schemas/page.schema.js'

const pagesRouter = Router()

pagesRouter.patch(
	'/:id/fields/order',
	validate('params', pageIdParamsSchema),
	validate('body', reorderFieldsSchema),
	pagesController.reorderFields
)
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
pagesRouter.delete(
	'/:id',
	validate('params', pageIdParamsSchema),
	pagesController.remove
)

export { pagesRouter }
