import type { FormPage } from '@/entities/form'

type FormPagesProps = {
	activePageId: number
	formId: number
	isDisabled: boolean
	pages: FormPage[]
	onPageAdded: (pageId: number) => void
	onPageSelect: (pageId: number) => void
}

export type { FormPagesProps }
