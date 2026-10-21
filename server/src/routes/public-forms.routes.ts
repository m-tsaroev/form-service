import { Router } from 'express'

import { formsController } from '@server/controllers/forms.controller.js'
import { submissionsController } from '@server/controllers/submissions.controller.js'
import { validate } from '@server/middleware/validate.middleware.js'
import { formSlugParamsSchema } from '@server/schemas/form.schema.js'
import { createSubmissionSchema } from '@server/schemas/submission.schema.js'

const publicFormsRouter = Router()

publicFormsRouter.get(
	'/:slug',
	validate('params', formSlugParamsSchema),
	formsController.getPublicBySlug
)

publicFormsRouter.post(
	'/:slug/submissions',
	validate('params', formSlugParamsSchema),
	validate('body', createSubmissionSchema),
	submissionsController.create
)

export { publicFormsRouter }
