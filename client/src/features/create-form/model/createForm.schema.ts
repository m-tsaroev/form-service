import { z } from 'zod'

const createFormSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'Введите название формы')
		.max(200, 'Название не должно превышать 200 символов'),
	description: z
		.string()
		.trim()
		.max(2000, 'Описание не должно превышать 2000 символов')
		.transform(value => value || null)
})

type CreateFormInput = z.input<typeof createFormSchema>
type CreateFormBody = z.output<typeof createFormSchema>

export { createFormSchema, type CreateFormBody, type CreateFormInput }
