import { z } from 'zod'

const fieldTypeSchema = z.enum([
	'text',
	'textarea',
	'email',
	'number',
	'radio',
	'checkbox',
	'select'
])

const optionSchema = z.object({
	id: z.string().trim().min(1).max(100),
	label: z.string().trim().min(1).max(200)
})

const optionsSchema = z
	.array(optionSchema)
	.default([])
	.superRefine((options, context) => {
		const optionIds = new Set<string>()

		for (const [index, option] of options.entries()) {
			if (optionIds.has(option.id)) {
				context.addIssue({
					code: 'custom',
					message: 'Option IDs must be unique',
					path: [index, 'id']
				})
			}

			optionIds.add(option.id)
		}
	})

const textConfigSchema = z
	.object({
		placeholder: z.string().trim().max(200).optional(),
		minLength: z.number().int().nonnegative().optional(),
		maxLength: z.number().int().positive().optional()
	})
	.strict()
	.refine(
		config =>
			config.minLength === undefined ||
			config.maxLength === undefined ||
			config.minLength <= config.maxLength,
		{
			message: 'minLength must not exceed maxLength',
			path: ['minLength']
		}
	)

const emailConfigSchema = z
	.object({
		placeholder: z.string().trim().max(200).optional(),
		maxLength: z.number().int().positive().optional()
	})
	.strict()

const numberConfigSchema = z
	.object({
		placeholder: z.string().trim().max(200).optional(),
		min: z.number().optional(),
		max: z.number().optional(),
		step: z.number().positive().optional()
	})
	.strict()
	.refine(
		config =>
			config.min === undefined ||
			config.max === undefined ||
			config.min <= config.max,
		{
			message: 'min must not exceed max',
			path: ['min']
		}
	)

const choiceConfigSchema = z
	.object({
		options: optionsSchema
	})
	.strict()

const checkboxConfigSchema = z
	.object({
		options: optionsSchema,
		minSelected: z.number().int().nonnegative().optional(),
		maxSelected: z.number().int().positive().optional()
	})
	.strict()
	.refine(
		config =>
			config.minSelected === undefined ||
			config.maxSelected === undefined ||
			config.minSelected <= config.maxSelected,
		{
			message: 'minSelected must not exceed maxSelected',
			path: ['minSelected']
		}
	)

const baseFieldShape = {
	label: z.string().trim().min(1).max(300),
	description: z.string().trim().max(1000).nullable().optional(),
	required: z.boolean().default(false)
}

const fieldDefinitionSchema = z.discriminatedUnion('type', [
	z.object({
		...baseFieldShape,
		type: z.literal('text'),
		config: textConfigSchema.default({})
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('textarea'),
		config: textConfigSchema.default({})
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('email'),
		config: emailConfigSchema.default({})
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('number'),
		config: numberConfigSchema.default({})
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('radio'),
		config: choiceConfigSchema.default({ options: [] })
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('checkbox'),
		config: checkboxConfigSchema.default({ options: [] })
	}),
	z.object({
		...baseFieldShape,
		type: z.literal('select'),
		config: choiceConfigSchema.default({ options: [] })
	})
])

type FieldDefinition = z.infer<typeof fieldDefinitionSchema>
type FieldOption = z.infer<typeof optionSchema>
type FieldType = z.infer<typeof fieldTypeSchema>

export {
	fieldDefinitionSchema,
	fieldTypeSchema,
	optionSchema,
	type FieldDefinition,
	type FieldOption,
	type FieldType
}
