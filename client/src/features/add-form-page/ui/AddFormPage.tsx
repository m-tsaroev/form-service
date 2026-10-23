import { Button } from '@shared/ui'
import { Plus } from 'lucide-react'

import { useFormEditorStore } from '@/entities/form'

import { useAddFormPage } from '../model/useAddFormPage'

import type { AddFormPageProps } from './AddFormPage.types'

const AddFormPage = (props: AddFormPageProps) => {
	const { formId, nextPageNumber, onPageAdded } = props
	const { addPage, error, isPending } = useAddFormPage(
		formId,
		nextPageNumber,
		onPageAdded
	)
	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)

	return (
		<>
			<Button
				variant='secondary'
				type='button'
				disabled={isEditorPending}
				isLoading={isPending}
				onClick={() => addPage()}
			>
				<Plus size={18} aria-hidden='true' />
				Добавить страницу
			</Button>
			{error && <p role='alert'>Не удалось добавить страницу.</p>}
		</>
	)
}

export { AddFormPage }
