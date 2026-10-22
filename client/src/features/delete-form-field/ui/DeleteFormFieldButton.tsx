import clsx from 'clsx'
import { Trash2 } from 'lucide-react'

import { useFormEditorStore } from '@/entities/form'

import { Button } from '@shared/ui'

import { useDeleteFormField } from '../model/useDeleteFormField'

import styles from './DeleteFormFieldButton.module.scss'
import type { DeleteFormFieldButtonProps } from './DeleteFormFieldButton.types'

const DeleteFormFieldButton = (props: DeleteFormFieldButtonProps) => {
	const { className, fieldId, fieldLabel, formId, showLabel = false } = props
	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)
	const { deleteField, error, isPending } = useDeleteFormField(formId)

	return (
		<div
			className={clsx(
				styles.control,
				showLabel && styles.withLabel,
				className
			)}
		>
			{showLabel ? (
				<Button
					className={clsx(styles.button, styles.labelButton)}
					variant='ghost'
					size='sm'
					type='button'
					disabled={isEditorPending}
					isLoading={isPending}
					onClick={() => deleteField(fieldId)}
				>
					<Trash2 size={18} aria-hidden='true' />
					<span>Удалить поле</span>
				</Button>
			) : (
				<Button
					className={styles.button}
					variant='ghost'
					size='sm'
					type='button'
					onlyIcon
					ariaLabel={`Удалить поле «${fieldLabel}»`}
					disabled={isEditorPending}
					isLoading={isPending}
					onClick={() => deleteField(fieldId)}
				>
					<Trash2 size={18} aria-hidden='true' />
				</Button>
			)}

			{error && (
				<span className={styles.error} role='alert'>
					Не удалось удалить поле
				</span>
			)}
		</div>
	)
}

export { DeleteFormFieldButton }
