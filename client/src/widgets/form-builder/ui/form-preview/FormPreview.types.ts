import type { FormTree } from '@/entities/form'

type FormPreviewProps = {
	form: FormTree
	activePageId: number
	selectedFieldId: number | null
	dirtyFieldIds: ReadonlySet<number>
	isDisabled: boolean
	onFieldSelect: (fieldId: number) => void
}

export type { FormPreviewProps }
