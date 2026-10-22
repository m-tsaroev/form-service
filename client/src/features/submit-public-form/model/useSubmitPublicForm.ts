import type { ApiError } from '@shared/api'
import { useMutation } from '@tanstack/react-query'

import { submitPublicForm } from '../api/submitPublicForm'

import type { Submission, SubmitPublicFormBody } from './submitPublicForm.types'

const useSubmitPublicForm = (slug: string) => {
	const mutation = useMutation<Submission, ApiError, SubmitPublicFormBody>({
		mutationFn: body => submitPublicForm(slug, body)
	})

	return {
		...mutation,
		submit: mutation.mutate,
		submitAsync: mutation.mutateAsync
	}
}

export { useSubmitPublicForm }
