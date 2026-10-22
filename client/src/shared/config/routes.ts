export const ROUTES = {
	ROOT: '/',
	ADMIN: '/admin',
	FORM_CREATE: '/admin/forms/new',
	FORM_ID(id: string | number) {
		return `/admin/forms/${id}`
	},
	FORM_PREVIEW(id: string | number) {
		return `/admin/forms/${id}/preview`
	},
	SUBMISSIONS(id: string | number) {
		return `/admin/forms/${id}/submissions`
	},
	SUBMISSION_ID(formId: string | number, submissionId: string | number) {
		return `/admin/forms/${formId}/submissions/${submissionId}`
	},
	PUBLIC_FORM(slug: string) {
		return `/forms/${slug}`
	},
	NOT_FOUND: '*'
} as const
