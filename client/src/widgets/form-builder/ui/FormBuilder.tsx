import clsx from 'clsx'
import { useEffect } from 'react'

import { useFormEditorStore } from '@/entities/form'
import { AddFormField } from '@/features/add-form-field'

import styles from './FormBuilder.module.scss'
import type { FormBuilderProps } from './FormBuilder.types'
import { FormPreview } from './form-preview/FormPreview'

const FormBuilder = (props: FormBuilderProps) => {
	const { form } = props

	const fields = form.pages.flatMap(page => page.fields)

	const dirtyFieldIds = useFormEditorStore(state => state.dirtyFieldIds)
	const pendingOperation = useFormEditorStore(state => state.pendingOperation)
	const selectField = useFormEditorStore(state => state.selectField)
	const selectedField = useFormEditorStore(state => state.selectedField)

	const confirmedSelectedField = fields.find(
		field => field.id === selectedField?.id
	)
	const isSelectedFieldDirty = selectedField
		? dirtyFieldIds.has(selectedField.id)
		: false

	useEffect(() => {
		if (!confirmedSelectedField) {
			selectField(fields[0] ?? null)
			return
		}

		if (!isSelectedFieldDirty && confirmedSelectedField !== selectedField) {
			selectField(confirmedSelectedField)
		}
	}, [
		confirmedSelectedField,
		fields,
		isSelectedFieldDirty,
		selectField,
		selectedField
	])

	const handleFieldSelect = (fieldId: number) => {
		if (pendingOperation) {
			return
		}

		selectField(fields.find(field => field.id === fieldId) ?? null)
	}

	return (
		<div
			className={clsx(styles.grid, pendingOperation && styles.isPending)}
			aria-busy={pendingOperation !== null}
		>
			<aside className={styles.sidebar}>
				<AddFormField formId={form.id} />
			</aside>

			<FormPreview
				form={form}
				selectedFieldId={selectedField?.id ?? null}
				dirtyFieldIds={dirtyFieldIds}
				isDisabled={pendingOperation !== null}
				onFieldSelect={handleFieldSelect}
			/>
		</div>
	)
}

export { FormBuilder }
