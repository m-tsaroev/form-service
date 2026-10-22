import type { FormTree } from '@/entities/form'

type FormPreviewProps = {
	form: FormTree
	selectedFieldId: number | null
	dirtyFieldIds: ReadonlySet<number>
	isDisabled: boolean
	onFieldSelect: (fieldId: number) => void
}

export type { FormPreviewProps }
