import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { type FormField, useFormEditorStore } from '@/entities/form'
import { AddFormField } from '@/features/add-form-field'
import { FieldSettings } from '@/features/update-form-field'
import { PageSettings } from '@/features/update-form-page'

import styles from './FormBuilder.module.scss'
import type { FormBuilderProps } from './FormBuilder.types'
import { FormPages } from './form-pages/FormPages'
import { FormPreview } from './form-preview/FormPreview'

const EMPTY_FIELDS: FormField[] = []

const FormBuilder = (props: FormBuilderProps) => {
	const { form } = props

	const hasInitializedSelection = useRef(false)
	const [activePageId, setActivePageId] = useState(form.pages[0]?.id ?? 0)
	const [fieldToRevealId, setFieldToRevealId] = useState<number | null>(null)

	const activePage =
		form.pages.find(page => page.id === activePageId) ?? form.pages[0]
	const fields = activePage?.fields ?? EMPTY_FIELDS
	const canRevealAddedField =
		fieldToRevealId !== null &&
		fields.some(field => field.id === fieldToRevealId)

	const dirtyFieldIds = useFormEditorStore(state => state.dirtyFieldIds)
	const fieldDrafts = useFormEditorStore(state => state.fieldDrafts)
	const pendingOperation = useFormEditorStore(state => state.pendingOperation)
	const selectField = useFormEditorStore(state => state.selectField)
	const selectedField = useFormEditorStore(state => state.selectedField)

	const confirmedSelectedField = fields.find(
		field => field.id === selectedField?.id
	)
	const isSelectedFieldDirty = selectedField
		? dirtyFieldIds.has(selectedField.id)
		: false

	const previewForm = {
		...form,
		pages: form.pages.map(page => ({
			...page,
			fields: page.fields.map(field => fieldDrafts.get(field.id) ?? field)
		}))
	}

	useEffect(() => {
		if (!hasInitializedSelection.current) {
			hasInitializedSelection.current = true
			selectField(null)
			return
		}

		if (!selectedField) {
			return
		}

		if (!confirmedSelectedField) {
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

	useEffect(() => {
		const handlePointerDown = (event: PointerEvent) => {
			if (!selectedField || pendingOperation) {
				return
			}

			const target = event.target
			if (!(target instanceof Element)) {
				return
			}

			const isInsideSettings = target.closest('[data-field-settings]')
			const isInsidePreviewField = target.closest('[data-form-field-id]')

			if (!isInsideSettings && !isInsidePreviewField) {
				selectField(null)
			}
		}

		document.addEventListener('pointerdown', handlePointerDown)
		return () => document.removeEventListener('pointerdown', handlePointerDown)
	}, [pendingOperation, selectField, selectedField])

	useEffect(() => {
		if (
			fieldToRevealId === null ||
			!canRevealAddedField ||
			pendingOperation !== null
		) {
			return
		}

		const frameId = requestAnimationFrame(() => {
			const fieldElement = document.querySelector<HTMLElement>(
				`[data-form-field-id='${fieldToRevealId}']`
			)

			if (!fieldElement) {
				return
			}

			fieldElement
				.querySelector<HTMLButtonElement>('[data-form-field-select]')
				?.focus({ preventScroll: true })

			if (fieldElement.getBoundingClientRect().bottom > window.innerHeight) {
				fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}

			setFieldToRevealId(null)
		})

		return () => cancelAnimationFrame(frameId)
	}, [canRevealAddedField, fieldToRevealId, pendingOperation])

	const handleFieldSelect = (fieldId: number) => {
		if (pendingOperation) {
			return
		}

		selectField(fields.find(field => field.id === fieldId) ?? null)
	}

	const handlePageSelect = (pageId: number) => {
		if (pendingOperation) {
			return
		}

		setActivePageId(pageId)
		selectField(null)
	}

	const handlePageAdded = (pageId: number) => {
		setActivePageId(pageId)
		selectField(null)
	}

	if (!activePage) {
		return null
	}

	return (
		<div
			className={clsx(styles.grid, pendingOperation && styles.isPending)}
			aria-busy={pendingOperation !== null}
		>
			<aside className={styles.sidebar}>
				<FormPages
					activePageId={activePage.id}
					formId={form.id}
					isDisabled={pendingOperation !== null}
					pages={form.pages}
					onPageAdded={handlePageAdded}
					onPageSelect={handlePageSelect}
				/>
				<AddFormField
					formId={form.id}
					pageId={activePage.id}
					onFieldAdded={setFieldToRevealId}
				/>
			</aside>

			<FormPreview
				form={previewForm}
				activePageId={activePage.id}
				selectedFieldId={selectedField?.id ?? null}
				dirtyFieldIds={dirtyFieldIds}
				isDisabled={pendingOperation !== null}
				onFieldSelect={handleFieldSelect}
			/>

			{selectedField ? (
				<FieldSettings field={selectedField} formId={form.id} />
			) : (
				<PageSettings formId={form.id} page={activePage} key={activePage.id} />
			)}
		</div>
	)
}

export { FormBuilder }
