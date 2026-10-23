import type { FormTree } from '@/entities/form'

type ReorderFormFieldsVariables = {
	pageId: number
	fieldIds: number[]
}

type ReorderFormFieldsContext = {
	previousTree?: FormTree
}

export type { ReorderFormFieldsContext, ReorderFormFieldsVariables }
