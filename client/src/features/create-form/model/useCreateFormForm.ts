import { zodResolver } from '@hookform/resolvers/zod'
import { ROUTES } from '@shared/config'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import {
	type CreateFormBody,
	type CreateFormInput,
	createFormSchema
} from './createForm.schema'
import { useCreateForm } from './useCreateForm'

const useCreateFormForm = () => {
	const navigate = useNavigate()
	const { create, error, isPending } = useCreateForm()

	const form = useForm<CreateFormInput, unknown, CreateFormBody>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			title: '',
			description: ''
		}
	})

	const handleSubmit = (values: CreateFormBody) => {
		create(values, {
			onSuccess: createdForm => {
				navigate(ROUTES.FORM_ID(createdForm.id), { replace: true })
			}
		})
	}

	const handleCancel = () => {
		navigate(-1)
	}

	return {
		error,
		form,
		handleCancel,
		handleSubmit,
		isPending
	}
}

export { useCreateFormForm }
