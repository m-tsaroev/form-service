import { Button } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useFormEditorStore } from '@/entities/form'

import { useDeleteFormPage } from '../model/useDeleteFormPage'

import styles from './DeleteFormPageButton.module.scss'
import type { DeleteFormPageButtonProps } from './DeleteFormPageButton.types'

const DeleteFormPageButton = (props: DeleteFormPageButtonProps) => {
	const { formId, onPageDeleted, pageId, pageTitle } = props
	const [isConfirming, setIsConfirming] = useState(false)
	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)
	const { deletePage, error, isPending, reset } = useDeleteFormPage(
		formId,
		onPageDeleted
	)

	const handleRequestDelete = () => {
		reset()
		setIsConfirming(true)
	}

	const handleCancel = () => {
		reset()
		setIsConfirming(false)
	}

	const errorMessage =
		error?.error.code === 'PAGE_HAS_ANSWERS'
			? 'Страницу с сохранёнными ответами нельзя удалить.'
			: error?.error.message

	return (
		<div className={styles.control}>
			{isConfirming ? (
				<div
					className={styles.confirmation}
					role='group'
					aria-label={`Подтвердить удаление страницы «${pageTitle}»`}
				>
					<Button
						variant='secondary'
						type='button'
						disabled={isPending}
						onClick={handleCancel}
					>
						Отмена
					</Button>
					<Button
						className={styles.confirmButton}
						variant='secondary'
						type='button'
						isLoading={isPending}
						onClick={() => deletePage(pageId)}
					>
						Удалить
					</Button>
				</div>
			) : (
				<Button
					className={styles.deleteButton}
					variant='ghost'
					type='button'
					disabled={isEditorPending}
					onClick={handleRequestDelete}
				>
					<Trash2 size={18} aria-hidden='true' />
					Удалить страницу
				</Button>
			)}

			{errorMessage && (
				<p className={styles.error} role='alert'>
					{errorMessage}
				</p>
			)}
		</div>
	)
}

export { DeleteFormPageButton }
