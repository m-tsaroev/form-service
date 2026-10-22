import { AdminLayout, HomeLayout, RootLayout } from '@app/layouts'
import { FormCreatePage } from '@pages/form-create'
import { FormEditorPage } from '@pages/form-editor'
import { FormPreviewPage } from '@pages/form-preview'
import { FormsPage } from '@pages/forms'
import { NotFoundPage } from '@pages/not-found'
import { PublicFormPage } from '@pages/public-form'
import { SubmissionPage } from '@pages/submission'
import { SubmissionsPage } from '@pages/submissions'
import { createBrowserRouter, redirect } from 'react-router'

import { RouteErrorBoundary } from './ui/RouteErrorBoundary'

export const router = createBrowserRouter([
	{
		Component: RootLayout,
		ErrorBoundary: RouteErrorBoundary,
		children: [
			{
				index: true,
				loader: () => redirect('/admin')
			},
			{
				path: 'admin',
				Component: AdminLayout,
				children: [
					{
						index: true,
						Component: FormsPage
					},
					{
						path: 'forms/new',
						Component: FormCreatePage
					},
					{
						path: 'forms/:id',
						Component: FormEditorPage
					},
					{
						path: 'forms/:id/preview',
						Component: FormPreviewPage
					},
					{
						path: 'forms/:id/submissions',
						Component: SubmissionsPage
					},
					{
						path: 'forms/:id/submissions/:submissionId',
						Component: SubmissionPage
					}
				]
			},
			{
				Component: HomeLayout,
				children: [
					{
						path: 'forms/:slug',
						Component: PublicFormPage
					}
				]
			},
			{
				path: '*',
				Component: NotFoundPage
			}
		]
	}
])
