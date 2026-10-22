import { Button, toast } from '@shared/ui'
import { EyeOff, Send } from 'lucide-react'

import { ROUTES } from '@/shared/config'

import { useFormEditorStore } from '@/entities/form'

import { usePublishForm } from '../model/usePublishForm'

import styles from './PublishFormButton.module.scss'
import type { PublishFormButtonProps } from './PublishFormButton.types'

const PublishFormButton = (props: PublishFormButtonProps) => {
	const { formId, isPublished } = props
	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)
	const { error, isPending, updatePublication } = usePublishForm(formId)
	const handlePublicationChange = () => {
		updatePublication(isPublished ? 'unpublish' : 'publish', {
			onSuccess: form => {
				if (form.status === 'draft') {
					toast.info('Форма снята с публикации', {
						description: 'Публичная ссылка временно недоступна.'
					})
					return
				}

				if (!form.slug) {
					return
				}

				const publicPath = ROUTES.PUBLIC_FORM(form.slug)
				const publicUrl = new URL(publicPath, window.location.origin).toString()

				toast.success('Форма опубликована', {
					description: publicUrl,
					action: (
						<a className={styles.toastAction} href={publicPath}>
							Открыть
						</a>
					)
				})
			}
		})
	}

	return (
		<div className={styles.action}>
			<Button
				className={styles.button}
				type='button'
				variant={isPublished ? 'secondary' : 'primary'}
				disabled={isEditorPending}
				isLoading={isPending}
				onClick={handlePublicationChange}
			>
				{isPublished ? (
					<EyeOff size={18} aria-hidden='true' />
				) : (
					<Send size={18} aria-hidden='true' />
				)}
				{isPublished ? 'Снять с публикации' : 'Опубликовать'}
			</Button>

			{error && (
				<p className={styles.error} role='alert'>
					{isPublished
						? 'Не удалось снять форму с публикации.'
						: 'Не удалось опубликовать форму. Проверьте заполнение полей.'}
				</p>
			)}
		</div>
	)
}

export { PublishFormButton }
