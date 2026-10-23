import {
	Button,
	Form,
	FormField,
	FormSection,
	Input,
	Textarea
} from '@shared/ui'
import { useFormContext } from 'react-hook-form'

import type { FormField as FormFieldModel } from '@/entities/form'
import {
	type PublicFormValues,
	usePublicFormForm
} from '@/features/submit-public-form'

import styles from './PublicForm.module.scss'
import type { PublicFormProps } from './PublicForm.types'

const DEFAULT_PLACEHOLDERS = {
	text: 'Введите ответ',
	textarea: 'Введите развернутый ответ',
	email: 'Введите email',
	number: 'Введите число'
} as const

const hasAvailableOptions = (field: FormFieldModel) =>
	(field.type !== 'radio' &&
		field.type !== 'checkbox' &&
		field.type !== 'select') ||
	field.config.options.length > 0

const PublicField = (props: { field: FormFieldModel; isDisabled: boolean }) => {
	const { field, isDisabled } = props

	const name = `answers.${field.id}` as const
	const controlId = name.replaceAll('.', '-')

	const { formState, register } = useFormContext<PublicFormValues>()
	const isInvalid = !!formState.errors.answers?.[field.id]

	const registration = register(
		name,
		field.type === 'number'
			? { setValueAs: value => (value === '' ? undefined : Number(value)) }
			: undefined
	)

	if (field.type === 'textarea') {
		return (
			<Textarea
				id={controlId}
				placeholder={field.config.placeholder ?? DEFAULT_PLACEHOLDERS.textarea}
				aria-invalid={isInvalid}
				disabled={isDisabled}
				{...registration}
			/>
		)
	}

	if (field.type === 'text' || field.type === 'email') {
		return (
			<Input
				id={controlId}
				type={field.type}
				placeholder={
					field.config.placeholder ?? DEFAULT_PLACEHOLDERS[field.type]
				}
				aria-invalid={isInvalid}
				disabled={isDisabled}
				{...registration}
			/>
		)
	}

	if (field.type === 'number') {
		return (
			<Input
				id={controlId}
				type='number'
				min={field.config.min}
				max={field.config.max}
				step={field.config.step}
				placeholder={field.config.placeholder ?? DEFAULT_PLACEHOLDERS.number}
				aria-invalid={isInvalid}
				disabled={isDisabled}
				{...registration}
			/>
		)
	}

	if (field.type === 'select') {
		return (
			<select
				id={controlId}
				className={styles.select}
				aria-invalid={isInvalid}
				disabled={isDisabled}
				{...registration}
			>
				<option value=''>Выберите вариант</option>
				{field.config.options.map(option => (
					<option value={option.id} key={option.id}>
						{option.label}
					</option>
				))}
			</select>
		)
	}

	return (
		<div className={styles.options} id={controlId} aria-invalid={isInvalid}>
			{field.config.options.map(option => (
				<label className={styles.option} key={option.id}>
					<input
						type={field.type}
						value={option.id}
						disabled={isDisabled}
						{...registration}
					/>
					<span>{option.label}</span>
				</label>
			))}
		</div>
	)
}

const PublicForm = (props: PublicFormProps) => {
	const { form: formTree, slug } = props

	const pages = formTree.pages.map(page => ({
		...page,
		fields: page.fields.filter(hasAvailableOptions)
	}))
	const fields = pages.flatMap(page => page.fields)
	const { error, form, handleSubmit, isPending, isSuccess } = usePublicFormForm(
		slug,
		fields
	)

	if (isSuccess) {
		return (
			<section className={styles.success} aria-live='polite'>
				<h1>Ответ отправлен</h1>
				<p>Спасибо! Ваши ответы успешно сохранены.</p>
			</section>
		)
	}

	return (
		<Form<PublicFormValues, PublicFormValues>
			form={form}
			className={styles.form}
			title={formTree.title}
			onSubmit={handleSubmit}
			noValidate
		>
			{formTree.description && (
				<p className={styles.description}>{formTree.description}</p>
			)}

			{pages.map(page => (
				<FormSection
					className={styles.section}
					title={page.title}
					description={page.description}
					key={page.id}
				>
					{page.fields.map(field => (
						<FormField<PublicFormValues>
							name={`answers.${field.id}`}
							label={field.label}
							isRequired={field.required}
							key={field.id}
						>
							<div className={styles.fieldContent}>
								{field.description && (
									<p className={styles.fieldDescription}>{field.description}</p>
								)}
								<PublicField field={field} isDisabled={isPending} />
							</div>
						</FormField>
					))}
				</FormSection>
			))}

			{error && (
				<p className={styles.submitError} role='alert'>
					Не удалось отправить ответы. Проверьте данные и попробуйте ещё раз.
				</p>
			)}

			<Button className={styles.submit} type='submit' isLoading={isPending}>
				Отправить
			</Button>
		</Form>
	)
}

export { PublicForm }
