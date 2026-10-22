import { create } from 'zustand'

import type { FormField } from './form.types'

type FormEditorOperationType = 'add' | 'update' | 'delete'

type FormEditorOperation = {
	type: FormEditorOperationType
	fieldId?: number
}

type FormEditorState = {
	selectedField: FormField | null
	dirtyFieldIds: ReadonlySet<number>
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
	pendingOperation: null,

	selectField: field => set({ selectedField: field }),
	updateSelectedField: field =>
		set(state => ({
			selectedField: field,
			dirtyFieldIds: new Set(state.dirtyFieldIds).add(field.id)
		})),

	markFieldDirty: fieldId =>
		set(state => ({
			dirtyFieldIds: new Set(state.dirtyFieldIds).add(fieldId)
		})),

	markFieldSaved: fieldId =>
		set(state => {
			const dirtyFieldIds = new Set(state.dirtyFieldIds)
			dirtyFieldIds.delete(fieldId)
			return { dirtyFieldIds }
		}),
    
	startOperation: operation => set({ pendingOperation: operation }),
	finishOperation: () => set({ pendingOperation: null })
}))

export { useFormEditorStore }
export type { FormEditorOperation, FormEditorOperationType }
