import { Button, toast } from '@shared/ui'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useDeleteForm } from '../model/useDeleteForm'

import styles from './DeleteFormButton.module.scss'
import type { DeleteFormButtonProps } from './DeleteFormButton.types'

const DeleteFormButton = (props: DeleteFormButtonProps) => {
	const { formId, formTitle, submissionCount, onDeleted } = props
	const { deleteForm, isPending } = useDeleteForm()
	const [isConfirming, setIsConfirming] = useState(false)

	const handleRequestDelete = () => {
		if (submissionCount > 0) {
			toast.warning('Форму нельзя удалить', {
				description: 'У формы есть сохранённые ответы.'
			})
			return
		}

		setIsConfirming(true)
	}

	const handleDelete = () => {
		deleteForm(formId, {
			onSuccess: () => {
				toast.success('Форма удалена')
				onDeleted()
			},
			onError: error => {
				setIsConfirming(false)
				toast.error('Не удалось удалить форму', {
					description:
						error.error.code === 'FORM_HAS_SUBMISSIONS'
							? 'У формы есть сохранённые ответы.'
							: error.error.message
				})
			}
		})
	}

	if (isConfirming) {
		return (
			<div
				className={styles.confirmation}
				role='group'
				aria-label={`Подтвердить удаление формы «${formTitle}»`}
			>
				<Button
					variant='secondary'
					disabled={isPending}
					onClick={() => setIsConfirming(false)}
				>
					Отмена
				</Button>
				<Button
					className={styles.confirmButton}
					variant='secondary'
					isLoading={isPending}
					onClick={handleDelete}
				>
					Удалить
				</Button>
			</div>
		)
	}

	return (
		<Button
			className={styles.deleteButton}
			variant='secondary'
			onClick={handleRequestDelete}
		>
			<Trash2 size={19} aria-hidden='true' />
			Удалить
		</Button>
	)
}

export { DeleteFormButton }
