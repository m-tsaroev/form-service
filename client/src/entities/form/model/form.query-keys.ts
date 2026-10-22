export const FORM_QUERY_KEYS = {
	all: ['forms'] as const,
	list: () => [...FORM_QUERY_KEYS.all, 'list'] as const,
	detail: (id: number) => [...FORM_QUERY_KEYS.all, 'detail', id] as const,
	publicDetail: (slug: string) =>
		[...FORM_QUERY_KEYS.all, 'public', slug] as const
}
