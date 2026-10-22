import { z } from 'zod'

const coercedNumber = z.coerce.number<number>('Введите число')
const optionalNumber = coercedNumber.optional()
const optionalPositiveNumber = coercedNumber
	.positive('Значение должно быть больше нуля')
	.optional()
const optionalNonNegativeInteger = coercedNumber
	.int('Введите целое число')
	.nonnegative('Значение не может быть отрицательным')
	.optional()
const optionalPositiveInteger = coercedNumber
	.int('Введите целое число')
	.positive('Значение должно быть больше нуля')
	.optional()

const optionSchema = z.object({
	id: z.string().min(1),
	label: z.string().trim().min(1, 'Введите название варианта').max(200)
})

const fieldSettingsSchema = z
	.object({
		type: z.enum([
			'text',
			'textarea',
			'email',
			'number',
			'radio',
			'checkbox',
			'select'
		]),
		label: z.string().trim().min(1, 'Введите название поля').max(300),
		description: z.string().trim().max(1000),
		required: z.boolean(),
		placeholder: z.string().trim().max(200),
		minLength: optionalNonNegativeInteger,
		maxLength: optionalPositiveInteger,
		min: optionalNumber,
		max: optionalNumber,
		step: optionalPositiveNumber,
		minSelected: optionalNonNegativeInteger,
		maxSelected: optionalPositiveInteger,
		options: z.array(optionSchema)
	})
	.superRefine((values, context) => {
		const optionIds = new Set<string>()
		values.options.forEach((option, index) => {
			if (optionIds.has(option.id)) {
				context.addIssue({
					code: 'custom',
					message: 'Идентификаторы вариантов должны быть уникальными',
					path: ['options', index, 'id']
				})
			}
			optionIds.add(option.id)
		})

		const addRangeIssue = (
			minimum: number | undefined,
			maximum: number | undefined,
			minimumPath: 'minLength' | 'min' | 'minSelected'
		) => {
			if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
				context.addIssue({
					code: 'custom',
					message: 'Минимум не может быть больше максимума',
					path: [minimumPath]
				})
			}
		}

		if (values.type === 'text' || values.type === 'textarea') {
			addRangeIssue(values.minLength, values.maxLength, 'minLength')
		}

		if (values.type === 'number') {
			addRangeIssue(values.min, values.max, 'min')
		}

		if (values.type === 'checkbox') {
			addRangeIssue(values.minSelected, values.maxSelected, 'minSelected')
		}
	})

type FieldSettingsValues = z.infer<typeof fieldSettingsSchema>

export { fieldSettingsSchema }
export type { FieldSettingsValues }
