import type { FormPage } from '@/entities/form'

type PageSettingsProps = {
	formId: number
	isLastPage: boolean
	onPageDeleted: (pageId: number) => void
	page: FormPage
}

export type { PageSettingsProps }
