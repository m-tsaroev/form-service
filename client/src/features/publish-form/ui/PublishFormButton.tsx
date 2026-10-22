import { Button, useToast } from '@shared/ui'
import { CircleCheck, Send } from 'lucide-react'

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
	const { showToast } = useToast()
	const { error, isPending, publish } = usePublishForm(formId)
	const handlePublish = () => {
		publish(undefined, {
			onSuccess: form => {
				if (!form.slug) {
					return
				}

				const publicPath = ROUTES.PUBLIC_FORM(form.slug)
				const publicUrl = new URL(publicPath, window.location.origin).toString()

				showToast({
					title: 'Форма опубликована',
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
				disabled={isPublished || isEditorPending}
				isLoading={isPending}
				onClick={handlePublish}
			>
				{isPublished ? (
					<CircleCheck size={18} aria-hidden='true' />
				) : (
					<Send size={18} aria-hidden='true' />
				)}
				{isPublished ? 'Опубликовано' : 'Опубликовать'}
			</Button>

			{error && (
				<p className={styles.error} role='alert'>
					Не удалось опубликовать форму. Проверьте заполнение полей.
				</p>
			)}
		</div>
	)
}

export { PublishFormButton }
