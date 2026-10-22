import { z } from 'zod'

const formTitleSchema = z.string().trim().min(1).max(200)
const formDescriptionSchema = z.string().trim().max(2000).nullable()
const formIdParamsSchema = z.object({
	id: z.coerce.number().int().positive()
})
const formSlugParamsSchema = z.object({
	slug: z.string().trim().min(1).max(100)
})
const formsQuerySchema = z
	.object({
		search: z.string().trim().max(200).optional()
	})
	.strict()

const createFormSchema = z
	.object({
		title: formTitleSchema,
		description: formDescriptionSchema.optional()
	})
	.strict()

const updateFormSchema = z
	.object({
		title: formTitleSchema.optional(),
		description: formDescriptionSchema.optional()
	})
	.strict()
	.refine(form => Object.keys(form).length > 0, {
		message: 'At least one field must be provided'
	})

type CreateFormInput = z.infer<typeof createFormSchema>
type UpdateFormInput = z.infer<typeof updateFormSchema>

export {
	createFormSchema,
	formIdParamsSchema,
	formSlugParamsSchema,
	formsQuerySchema,
	updateFormSchema,
	type CreateFormInput,
	type UpdateFormInput
}
