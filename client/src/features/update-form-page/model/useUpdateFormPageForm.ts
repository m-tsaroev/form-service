import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { FormPage } from '@/entities/form'

import {
	type PageSettingsInput,
	type UpdateFormPageBody,
	pageSettingsSchema
} from './pageSettings.schema'
import { useUpdateFormPage } from './useUpdateFormPage'

const useUpdateFormPageForm = (page: FormPage, formId: number) => {
	const { error, isPending, updatePage } = useUpdateFormPage(formId)
	const form = useForm<PageSettingsInput, unknown, UpdateFormPageBody>({
		resolver: zodResolver(pageSettingsSchema),
		defaultValues: {
			title: page.title ?? '',
			description: page.description ?? ''
		}
	})

	const handleSubmit = (body: UpdateFormPageBody) => {
		updatePage(
			{ pageId: page.id, body },
			{
				onSuccess: updatedPage => {
					form.reset({
						title: updatedPage.title ?? '',
						description: updatedPage.description ?? ''
					})
				}
			}
		)
	}

	return { error, form, handleSubmit, isPending }
}

export { useUpdateFormPageForm }
