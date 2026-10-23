import {
	Button,
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
	toast
} from '@shared/ui'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/shared/config'

import { useDeleteForm } from '../model/useDeleteForm'

import styles from './FormActionsMenu.module.scss'
import type { FormActionsMenuProps } from './FormActionsMenu.types'

const FormActionsMenu = (props: FormActionsMenuProps) => {
	const { formId, formTitle, submissionCount } = props
	const navigate = useNavigate()
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

	return (
		<div className={styles.control}>
			{isConfirming ? (
				<div
					className={styles.confirmation}
					role='group'
					aria-label={`Подтвердить удаление формы «${formTitle}»`}
				>
					<Button
						className={styles.button}
						variant='ghost'
						size='sm'
						type='button'
						disabled={isPending}
						onClick={() => setIsConfirming(false)}
					>
						Отмена
					</Button>
					<Button
						className={styles.deleteButton}
						variant='ghost'
						size='sm'
						type='button'
						isLoading={isPending}
						onClick={handleDelete}
					>
						Удалить
					</Button>
				</div>
			) : (
				<Dropdown>
					<DropdownTrigger asChild>
						<Button
							className={styles.button}
							variant='ghost'
							size='sm'
							type='button'
							onlyIcon
							ariaLabel={`Действия с формой «${formTitle}»`}
						>
							<Ellipsis size={19} aria-hidden='true' />
						</Button>
					</DropdownTrigger>
					<DropdownContent align='end'>
						<DropdownItem
							className={styles.menuItem}
							onSelect={() => navigate(ROUTES.FORM_ID(formId))}
						>
							<Pencil size={16} aria-hidden='true' />
							Редактировать
						</DropdownItem>
						<DropdownItem
							className={styles.deleteItem}
							onSelect={handleRequestDelete}
						>
							<Trash2 size={16} aria-hidden='true' />
							Удалить
						</DropdownItem>
					</DropdownContent>
				</Dropdown>
			)}
		</div>
	)
}

export { FormActionsMenu }
