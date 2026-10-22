import {
	Button,
	CardSeparator,
	Form,
	FormField,
	FormSection,
	Input,
	Textarea
} from '@shared/ui'
import { Plus, Settings, X } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

import { useFormEditorStore } from '@/entities/form'
import { DeleteFormFieldButton } from '@/features/delete-form-field'

import type { FieldSettingsValues } from '../model/fieldSettings.schema'
import { useUpdateFormFieldForm } from '../model/useUpdateFormFieldForm'

import styles from './FieldSettings.module.scss'
import type {
	FieldSettingsFormProps,
	FieldSettingsProps
} from './FieldSettings.types'

const optionalNumberInput = {
	setValueAs: (value: string) => (value === '' ? undefined : Number(value))
}

const FieldSettingsForm = (props: FieldSettingsFormProps) => {
	const { field, formId } = props

	const isEditorPending = useFormEditorStore(
		state => state.pendingOperation !== null
	)

	const { error, form, handleSubmit, isPending } = useUpdateFormFieldForm(
		field,
		formId
	)

	const {
		append,
		fields: options,
		remove
	} = useFieldArray({
		control: form.control,
		name: 'options',
		keyName: 'formKey'
	})

	const isText = field.type === 'text' || field.type === 'textarea'
	const isChoice =
		field.type === 'radio' ||
		field.type === 'checkbox' ||
		field.type === 'select'

	return (
		<Form form={form} onSubmit={handleSubmit} isCustom>
			<fieldset className={styles.fieldset} disabled={isEditorPending}>
				<FormSection className={styles.mainSettings}>
					<FormField<FieldSettingsValues>
						className={styles.field}
						name='label'
						label='Название поля'
					>
						<Input
							id='label'
							aria-invalid={!!form.formState.errors.label}
							{...form.register('label')}
						/>
					</FormField>

					<FormField<FieldSettingsValues>
						className={styles.field}
						name='description'
						label='Описание'
					>
						<Textarea
							id='description'
							className={styles.description}
							placeholder='Подсказка для пользователя'
							aria-invalid={!!form.formState.errors.description}
							{...form.register('description')}
						/>
					</FormField>

					<label className={styles.switchField}>
						<input
							className={styles.switchInput}
							type='checkbox'
							{...form.register('required')}
						/>
						<span className={styles.switch} aria-hidden='true' />
						<span>Обязательное поле</span>
					</label>
				</FormSection>

				<CardSeparator />

				<FormSection className={styles.parameters} title='Параметры'>
					{(isText || field.type === 'email' || field.type === 'number') && (
						<FormField<FieldSettingsValues>
							className={styles.field}
							name='placeholder'
							label='Placeholder'
						>
							<Input
								id='placeholder'
								aria-invalid={!!form.formState.errors.placeholder}
								{...form.register('placeholder')}
							/>
						</FormField>
					)}

					{isText && (
						<div className={styles.row}>
							<FormField<FieldSettingsValues>
								className={styles.field}
								name='minLength'
								label='Мин. длина'
							>
								<Input
									id='minLength'
									type='number'
									min={0}
									step={1}
									aria-invalid={!!form.formState.errors.minLength}
									{...form.register('minLength', optionalNumberInput)}
								/>
							</FormField>
							<FormField<FieldSettingsValues>
								className={styles.field}
								name='maxLength'
								label='Макс. длина'
							>
								<Input
									id='maxLength'
									type='number'
									min={1}
									step={1}
									aria-invalid={!!form.formState.errors.maxLength}
									{...form.register('maxLength', optionalNumberInput)}
								/>
							</FormField>
						</div>
					)}

					{field.type === 'email' && (
						<FormField<FieldSettingsValues>
							className={styles.field}
							name='maxLength'
							label='Макс. длина'
						>
							<Input
								id='maxLength'
								type='number'
								min={1}
								step={1}
								aria-invalid={!!form.formState.errors.maxLength}
								{...form.register('maxLength', optionalNumberInput)}
							/>
						</FormField>
					)}

					{field.type === 'number' && (
						<>
							<div className={styles.row}>
								<FormField<FieldSettingsValues>
									className={styles.field}
									name='min'
									label='Минимум'
								>
									<Input
										id='min'
										type='number'
										step='any'
										aria-invalid={!!form.formState.errors.min}
										{...form.register('min', optionalNumberInput)}
									/>
								</FormField>
								<FormField<FieldSettingsValues>
									className={styles.field}
									name='max'
									label='Максимум'
								>
									<Input
										id='max'
										type='number'
										step='any'
										aria-invalid={!!form.formState.errors.max}
										{...form.register('max', optionalNumberInput)}
									/>
								</FormField>
							</div>
							<FormField<FieldSettingsValues>
								className={styles.field}
								name='step'
								label='Шаг'
							>
								<Input
									id='step'
									type='number'
									step='any'
									aria-invalid={!!form.formState.errors.step}
									{...form.register('step', optionalNumberInput)}
								/>
							</FormField>
						</>
					)}

					{isChoice && (
						<div className={styles.optionsSection}>
							<div className={styles.optionsHeading}>
								<span>Варианты ответа</span>
								<Button
									className={styles.addOptionButton}
									variant='ghost'
									size='sm'
									type='button'
									onClick={() =>
										append(
											{ id: crypto.randomUUID(), label: '' },
											{ focusName: `options.${options.length}.label` }
										)
									}
								>
									<Plus size={16} aria-hidden='true' />
									Добавить
								</Button>
							</div>

							<div className={styles.options}>
								{options.map((option, index) => (
									<FormField<FieldSettingsValues>
										className={styles.optionField}
										name={`options.${index}.label`}
										label={`Вариант ${index + 1}`}
										key={option.formKey}
									>
										<input
											type='hidden'
											{...form.register(`options.${index}.id`)}
										/>
										<Input
											id={`options-${index}-label`}
											placeholder={`Вариант ${index + 1}`}
											aria-label={`Вариант ${index + 1}`}
											aria-invalid={
												!!form.formState.errors.options?.[index]?.label
											}
											{...form.register(`options.${index}.label`)}
										/>
										<Button
											variant='ghost'
											size='sm'
											type='button'
											onlyIcon
											ariaLabel={`Удалить вариант ${index + 1}`}
											onClick={() => remove(index)}
										>
											<X size={16} aria-hidden='true' />
										</Button>
									</FormField>
								))}
							</div>
						</div>
					)}

					{field.type === 'checkbox' && (
						<div className={styles.row}>
							<FormField<FieldSettingsValues>
								className={styles.field}
								name='minSelected'
								label='Мин. выбрано'
							>
								<Input
									id='minSelected'
									type='number'
									min={0}
									step={1}
									aria-invalid={!!form.formState.errors.minSelected}
									{...form.register('minSelected', optionalNumberInput)}
								/>
							</FormField>
							<FormField<FieldSettingsValues>
								className={styles.field}
								name='maxSelected'
								label='Макс. выбрано'
							>
								<Input
									id='maxSelected'
									type='number'
									min={1}
									step={1}
									aria-invalid={!!form.formState.errors.maxSelected}
									{...form.register('maxSelected', optionalNumberInput)}
								/>
							</FormField>
						</div>
					)}
				</FormSection>

				{error && (
					<p className={styles.submitError} role='alert'>
						Не удалось сохранить поле. {error.error.message}
					</p>
				)}
				{form.formState.isSubmitted &&
					Object.keys(form.formState.errors).length > 0 && (
						<p className={styles.submitError} role='alert'>
							Проверьте заполнение параметров поля.
						</p>
					)}

				<Button type='submit' isLoading={isPending}>
					Сохранить поле
				</Button>

				<DeleteFormFieldButton
					fieldId={field.id}
					fieldLabel={field.label}
					formId={formId}
					showLabel
				/>
			</fieldset>
		</Form>
	)
}

const FieldSettings = (props: FieldSettingsProps) => {
	const { field, formId } = props

	return (
		<aside
			className={styles.panel}
			data-field-settings
			aria-labelledby='field-settings-title'
		>
			<div className={styles.heading}>
				<Settings size={22} aria-hidden='true' />
				<h2 className={styles.title} id='field-settings-title'>
					Настройки поля
				</h2>
			</div>

			<div className={styles.content} key={field?.id ?? 'empty'}>
				{field ? (
					<FieldSettingsForm field={field} formId={formId} />
				) : (
					<p className={styles.emptyState}>
						Выберите поле в предпросмотре, чтобы изменить его настройки
					</p>
				)}
			</div>
		</aside>
	)
}

export { FieldSettings }
