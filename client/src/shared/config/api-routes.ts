export const API_ROUTES = {
	HEALTH: '/health',
	FORMS: '/forms',
	FORM_ID(id: string | number) {
		return `/forms/${id}`
	},
	FORM_FIELDS(id: string | number) {
		return `/forms/${id}/fields`
	},
	FORM_PAGES(id: string | number) {
		return `/forms/${id}/pages`
	},
	FORM_PUBLISH(id: string | number) {
		return `/forms/${id}/publish`
	},
	FORM_UNPUBLISH(id: string | number) {
		return `/forms/${id}/unpublish`
	},
	FORM_SUBMISSIONS(id: string | number) {
		return `/forms/${id}/submissions`
	},
	FORM_SUBMISSION_ID(formId: string | number, submissionId: string | number) {
		return `/forms/${formId}/submissions/${submissionId}`
	},
	FIELD_ID(id: string | number) {
		return `/fields/${id}`
	},
	PAGE_ID(id: string | number) {
		return `/pages/${id}`
	},
	PAGE_FIELDS(id: string | number) {
		return `/pages/${id}/fields`
	},
	PUBLIC_FORM(slug: string) {
		return `/public/forms/${slug}`
	},
	PUBLIC_FORM_SUBMISSIONS(slug: string) {
		return `/public/forms/${slug}/submissions`
	}
} as const
