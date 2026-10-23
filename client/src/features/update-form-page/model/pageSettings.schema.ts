import { z } from 'zod'

const pageSettingsSchema = z.object({
	title: z
		.string()
		.trim()
		.max(200, 'Название не должно превышать 200 символов')
		.transform(value => value || null),
	description: z
		.string()
		.trim()
		.max(2000, 'Описание не должно превышать 2000 символов')
		.transform(value => value || null)
})

type PageSettingsInput = z.input<typeof pageSettingsSchema>
type UpdateFormPageBody = z.output<typeof pageSettingsSchema>

export { pageSettingsSchema, type PageSettingsInput, type UpdateFormPageBody }
