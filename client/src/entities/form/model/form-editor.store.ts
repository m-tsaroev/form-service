import { create } from 'zustand'

import type { FormField } from './form.types'

type FormEditorOperationType =
	| 'add'
	| 'update'
	| 'delete'
	| 'add-page'
	| 'update-page'
	| 'publish'
	| 'unpublish'

type FormEditorOperation = {
	type: FormEditorOperationType
	fieldId?: number
}

type FormEditorState = {
	selectedField: FormField | null
	dirtyFieldIds: ReadonlySet<number>
	fieldDrafts: ReadonlyMap<number, FormField>
	pendingOperation: FormEditorOperation | null
	selectField: (field: FormField | null) => void
	updateSelectedField: (field: FormField) => void
	markFieldDirty: (fieldId: number) => void
	markFieldSaved: (fieldId: number) => void
	startOperation: (operation: FormEditorOperation) => void
	finishOperation: () => void
}

const useFormEditorStore = create<FormEditorState>(set => ({
	selectedField: null,
	dirtyFieldIds: new Set<number>(),
	fieldDrafts: new Map<number, FormField>(),
	pendingOperation: null,

	selectField: field =>
		set(state => ({
			selectedField: field ? (state.fieldDrafts.get(field.id) ?? field) : null
		})),
	updateSelectedField: field =>
		set(state => {
			const fieldDrafts = new Map(state.fieldDrafts)
			fieldDrafts.set(field.id, field)

			return {
				selectedField: field,
				dirtyFieldIds: new Set(state.dirtyFieldIds).add(field.id),
				fieldDrafts
			}
		}),

	markFieldDirty: fieldId =>
		set(state => ({
			dirtyFieldIds: new Set(state.dirtyFieldIds).add(fieldId)
		})),

	markFieldSaved: fieldId =>
		set(state => {
			const dirtyFieldIds = new Set(state.dirtyFieldIds)
			const fieldDrafts = new Map(state.fieldDrafts)
			dirtyFieldIds.delete(fieldId)
			fieldDrafts.delete(fieldId)

			return { dirtyFieldIds, fieldDrafts }
		}),

	startOperation: operation => set({ pendingOperation: operation }),
	finishOperation: () => set({ pendingOperation: null })
}))

export { useFormEditorStore }
export type { FormEditorOperation, FormEditorOperationType }
