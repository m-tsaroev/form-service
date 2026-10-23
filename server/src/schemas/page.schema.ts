import { z } from 'zod'

const pageTitleSchema = z.string().trim().min(1).max(200).nullable()
const pageDescriptionSchema = z.string().trim().max(2000).nullable()

const pageIdParamsSchema = z.object({
	id: z.coerce.number().int().positive()
})

const createPageSchema = z
	.object({
		title: pageTitleSchema.optional(),
		description: pageDescriptionSchema.optional()
	})
	.strict()

const updatePageSchema = createPageSchema.refine(
	page => Object.keys(page).length > 0,
	{
		message: 'At least one field must be provided'
	}
)

type CreatePageInput = z.infer<typeof createPageSchema>
type UpdatePageInput = z.infer<typeof updatePageSchema>

export {
	createPageSchema,
	pageIdParamsSchema,
	updatePageSchema,
	type CreatePageInput,
	type UpdatePageInput
}
