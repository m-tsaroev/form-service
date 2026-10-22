import { z } from 'zod'

import type { FormField } from '@/entities/form'

import type { PublicFormValues } from './submitPublicForm.types'

const isEmpty = (value: unknown) =>
	value === undefined ||
	value === '' ||
	(Array.isArray(value) && value.length === 0)

const addIssue = (
	context: z.RefinementCtx,
	field: FormField,
	message: string
) => {
	context.addIssue({
		code: 'custom',
		message,
		path: [String(field.id)]
	})
}

const validateField = (
	field: FormField,
	value: unknown,
	context: z.RefinementCtx
) => {
	if (isEmpty(value)) {
		if (field.required) {
			addIssue(context, field, 'Заполните обязательное поле')
		}
		return
	}

	switch (field.type) {
		case 'text':
		case 'textarea': {
			if (typeof value !== 'string') {
				addIssue(context, field, 'Введите текст')
				return
			}
			if (
				field.config.minLength !== undefined &&
				value.length < field.config.minLength
			) {
				addIssue(context, field, `Минимум ${field.config.minLength} символов`)
			}
			if (
				field.config.maxLength !== undefined &&
				value.length > field.config.maxLength
			) {
				addIssue(context, field, `Максимум ${field.config.maxLength} символов`)
			}
			return
		}
		case 'email': {
			if (typeof value !== 'string' || !z.email().safeParse(value).success) {
				addIssue(context, field, 'Введите корректный email')
				return
			}
			if (
				field.config.maxLength !== undefined &&
				value.length > field.config.maxLength
			) {
				addIssue(context, field, `Максимум ${field.config.maxLength} символов`)
			}
			return
		}
		case 'number': {
			if (typeof value !== 'number' || !Number.isFinite(value)) {
				addIssue(context, field, 'Введите число')
				return
			}
			if (field.config.min !== undefined && value < field.config.min) {
				addIssue(context, field, `Минимальное значение — ${field.config.min}`)
			}
			if (field.config.max !== undefined && value > field.config.max) {
				addIssue(context, field, `Максимальное значение — ${field.config.max}`)
			}
			if (field.config.step !== undefined) {
				const base = field.config.min ?? 0
				const quotient = (value - base) / field.config.step

				if (Math.abs(quotient - Math.round(quotient)) >= 1e-9) {
					addIssue(context, field, `Шаг значения — ${field.config.step}`)
				}
			}
			return
		}
		case 'radio':
		case 'select':
			if (
				typeof value !== 'string' ||
				!field.config.options.some(option => option.id === value)
			) {
				addIssue(context, field, 'Выберите доступный вариант')
			}
			return
		case 'checkbox': {
			if (
				!Array.isArray(value) ||
				!value.every(item => typeof item === 'string')
			) {
				addIssue(context, field, 'Выберите доступные варианты')
				return
			}
			const optionIds = new Set(field.config.options.map(option => option.id))
			if (
				new Set(value).size !== value.length ||
				value.some(id => !optionIds.has(id))
			) {
				addIssue(context, field, 'Выберите доступные варианты')
				return
			}
			if (
				field.config.minSelected !== undefined &&
				value.length < field.config.minSelected
			) {
				addIssue(context, field, `Выберите минимум ${field.config.minSelected}`)
			}
			if (
				field.config.maxSelected !== undefined &&
				value.length > field.config.maxSelected
			) {
				addIssue(
					context,
					field,
					`Выберите не больше ${field.config.maxSelected}`
				)
			}
		}
	}
}

const createPublicFormSchema = (
	fields: FormField[]
): z.ZodType<PublicFormValues, PublicFormValues> =>
	z.object({
		answers: z
			.record(z.string(), z.unknown())
			.superRefine((answers, context) => {
				for (const field of fields) {
					validateField(field, answers[String(field.id)], context)
				}
			})
	})

export { createPublicFormSchema }
