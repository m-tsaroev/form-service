import { Button, Form, FormField, Input, Textarea } from '@shared/ui'
import { ArrowRight } from 'lucide-react'

import type { CreateFormInput } from '../model/createForm.schema'
import { useCreateFormForm } from '../model/useCreateFormForm'

import styles from './CreateForm.module.scss'

const CreateForm = () => {
	const { error, form, handleCancel, handleSubmit, isPending } =
		useCreateFormForm()

	return (
		<div className={styles.wrapper}>
			<Form
				className={styles.form}
				form={form}
				title='Основная информация'
				onSubmit={handleSubmit}
			>
				<FormField<CreateFormInput>
					name='title'
					label='Название формы'
					isRequired
				>
					<div className={styles.fieldContent}>
						<Input
							id='title'
							placeholder='Например, анкета участника'
							aria-invalid={!!form.formState.errors.title}
							disabled={isPending}
							{...form.register('title')}
						/>
						<p className={styles.hint}>Название будет видно участникам</p>
					</div>
				</FormField>

				<FormField<CreateFormInput> name='description' label='Описание'>
					<div className={styles.fieldContent}>
						<Textarea
							id='description'
							placeholder='Расскажите, для чего предназначена форма'
							aria-invalid={!!form.formState.errors.description}
							disabled={isPending}
							{...form.register('description')}
						/>
						<p className={styles.hint}>Можно оставить пустым</p>
					</div>
				</FormField>

				{error && (
					<p className={styles.submitError} role='alert'>
						Не удалось создать форму. Попробуйте ещё раз.
					</p>
				)}

				<div className={styles.actions}>
					<Button
						type='button'
						variant='secondary'
						disabled={isPending}
						onClick={handleCancel}
					>
						Отмена
					</Button>
					<Button type='submit' isLoading={isPending}>
						Создать форму
						<ArrowRight size={18} aria-hidden='true' />
					</Button>
				</div>
			</Form>
		</div>
	)
}

export { CreateForm }
