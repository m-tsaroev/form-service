import type { FormStatus } from '@/entities/form'

export type FormBuilderHeaderProps = {
	title: string
	description: string
	formId?: number
	slug?: string | null
	status?: FormStatus
}
