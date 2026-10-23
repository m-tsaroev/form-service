const SUBMISSION_QUERY_KEYS = {
	all: ['submissions'] as const,
	lists: () => [...SUBMISSION_QUERY_KEYS.all, 'list'] as const,
	list: (formId: number) => [...SUBMISSION_QUERY_KEYS.lists(), formId] as const
}

export { SUBMISSION_QUERY_KEYS }
