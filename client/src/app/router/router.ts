import { AdminLayout, HomeLayout, RootLayout } from '@app/layouts'
import { FormCreatePage } from '@pages/form-create'
import { FormEditorPage } from '@pages/form-editor'
import { FormPreviewPage } from '@pages/form-preview'
import { FormsPage } from '@pages/forms'
import { NotFoundPage } from '@pages/not-found'
import { PublicFormPage } from '@pages/public-form'
import { SubmissionPage } from '@pages/submission'
import { SubmissionsPage } from '@pages/submissions'
import { ROUTES } from '@shared/config'
import { createBrowserRouter, redirect } from 'react-router'

import { RouteErrorBoundary } from './ui/RouteErrorBoundary'

export const router = createBrowserRouter([
	{
		Component: RootLayout,
		ErrorBoundary: RouteErrorBoundary,
		children: [
			{
				index: true,
				loader: () => redirect(ROUTES.ADMIN)
			},
			{
				path: ROUTES.ADMIN,
				Component: AdminLayout,
				children: [
					{
						index: true,
						Component: FormsPage
					},
					{
					path: ROUTES.FORM_CREATE,
						Component: FormCreatePage
					},
					{
					path: ROUTES.FORM_ID(':id'),
						Component: FormEditorPage
					},
					{
					path: ROUTES.FORM_PREVIEW(':id'),
						Component: FormPreviewPage
					},
					{
					path: ROUTES.SUBMISSIONS(':id'),
						Component: SubmissionsPage
					},
					{
					path: ROUTES.SUBMISSION_ID(':id', ':submissionId'),
						Component: SubmissionPage
					}
				]
			},
			{
				Component: HomeLayout,
				children: [
					{
						path: ROUTES.PUBLIC_FORM(':slug'),
						Component: PublicFormPage
					}
				]
			},
			{
				path: ROUTES.NOT_FOUND,
				Component: NotFoundPage
			}
		]
	}
])
