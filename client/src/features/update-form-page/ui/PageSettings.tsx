import { Button, Form, FormField, Input, Textarea } from '@shared/ui'
import { FilePenLine } from 'lucide-react'

import { useFormEditorStore } from '@/entities/form'

import type { PageSettingsInput } from '../model/pageSettings.schema'
import { useUpdateFormPageForm } from '../model/useUpdateFormPageForm'

import styles from './PageSettings.module.scss'
import type { PageSettingsProps } from './PageSettings.types'

const PageSettings = (props: PageSettingsProps) => {
	const { formId, page } = props
	const { error, form, handleSubmit, isPending } = useUpdateFormPageForm(
		page,
		formId
	)
	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)

	return (
		<aside
			className={styles.panel}
			data-field-settings
			aria-labelledby='page-settings-title'
		>
			<div className={styles.heading}>
				<FilePenLine size={22} aria-hidden='true' />
				<h2 className={styles.title} id='page-settings-title'>
					Настройки страницы
				</h2>
			</div>

			<Form form={form} onSubmit={handleSubmit} isCustom>
				<fieldset className={styles.fieldset} disabled={isEditorPending}>
					<FormField<PageSettingsInput> name='title' label='Название страницы'>
						<Input
							id='title'
							placeholder='Например, Контактные данные'
							aria-invalid={!!form.formState.errors.title}
							{...form.register('title')}
						/>
					</FormField>

					<FormField<PageSettingsInput> name='description' label='Описание'>
						<Textarea
							id='description'
							className={styles.description}
							placeholder='Дополнительная информация для участника'
							aria-invalid={!!form.formState.errors.description}
							{...form.register('description')}
						/>
					</FormField>

					{error && (
						<p className={styles.error} role='alert'>
							Не удалось сохранить страницу. {error.error.message}
						</p>
					)}

					<Button type='submit' isLoading={isPending}>
						Сохранить страницу
					</Button>
				</fieldset>
			</Form>
		</aside>
	)
}

export { PageSettings }
