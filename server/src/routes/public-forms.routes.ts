import { Router } from 'express'

import { formsController } from '@server/controllers/forms.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import { formSlugParamsSchema } from '@server/schemas/form.schema.js'

const publicFormsRouter = Router()

publicFormsRouter.get(
	'/:slug',
	validate('params', formSlugParamsSchema),
	formsController.getPublicBySlug
)

export { publicFormsRouter }
