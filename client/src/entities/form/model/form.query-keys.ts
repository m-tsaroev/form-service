export const FORM_QUERY_KEYS = {
	all: ['forms'] as const,
	lists: () => [...FORM_QUERY_KEYS.all, 'list'] as const,
	list: (search = '') => [...FORM_QUERY_KEYS.lists(), search] as const,
	detail: (id: number) => [...FORM_QUERY_KEYS.all, 'detail', id] as const,
	publicDetail: (slug: string) =>
		[...FORM_QUERY_KEYS.all, 'public', slug] as const
}
