import { Router } from 'express'

import { fieldsController } from '@server/controllers/fields.controller.js'
import { formsController } from '@server/controllers/forms.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import {
	fieldDefinitionSchema,
	fieldIdParamsSchema
} from '@server/schemas/field.schema.js'
import {
	createFormSchema,
	formIdParamsSchema,
	updateFormSchema
} from '@server/schemas/form.schema.js'

const formsRouter = Router()

formsRouter.get('/', formsController.getAll)
formsRouter.post(
	'/',
	validate('body', createFormSchema),
	formsController.create
)
formsRouter.post(
	'/:id/fields',
	validate('params', fieldIdParamsSchema),
	validate('body', fieldDefinitionSchema),
	fieldsController.create
)
formsRouter.get(
	'/:id',
	validate('params', formIdParamsSchema),
	formsController.getById
)
formsRouter.patch(
	'/:id',
	validate('params', formIdParamsSchema),
	validate('body', updateFormSchema),
	formsController.update
)

export { formsRouter }
