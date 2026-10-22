import { Router } from 'express'

import { fieldsController } from '@server/controllers/fields.controller.js'
import { formsController } from '@server/controllers/forms.controller.js'
import { submissionsController } from '@server/controllers/submissions.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import {
	fieldDefinitionSchema,
	fieldIdParamsSchema
} from '@server/schemas/field.schema.js'
import {
	createFormSchema,
	formIdParamsSchema,
	formsQuerySchema,
	updateFormSchema
} from '@server/schemas/form.schema.js'
import { submissionParamsSchema } from '@server/schemas/submission.schema.js'

const formsRouter = Router()

formsRouter.get('/', validate('query', formsQuerySchema), formsController.getAll)
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
formsRouter.post(
	'/:id/publish',
	validate('params', formIdParamsSchema),
	formsController.publish
)
formsRouter.get(
	'/:id/submissions',
	validate('params', formIdParamsSchema),
	submissionsController.getAll
)
formsRouter.get(
	'/:id/submissions/:submissionId',
	validate('params', submissionParamsSchema),
	submissionsController.getById
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
