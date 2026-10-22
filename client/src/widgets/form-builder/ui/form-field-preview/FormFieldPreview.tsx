import clsx from 'clsx'
import { ChevronDown, GripVertical } from 'lucide-react'

import type { FormField } from '@/entities/form'
import { DeleteFormFieldButton } from '@/features/delete-form-field'

import { Input, Textarea } from '@shared/ui'

import styles from './FormFieldPreview.module.scss'
import type { FormFieldPreviewProps } from './FormFieldPreview.types'

const FIELD_TYPE_LABELS: Record<FormField['type'], string> = {
	text: 'Текст',
	textarea: 'Абзац',
	email: 'Email',
	number: 'Число',
	radio: 'Один вариант',
	checkbox: 'Несколько вариантов',
	select: 'Выпадающий список'
}

const DEFAULT_PLACEHOLDERS: Record<
	'text' | 'textarea' | 'email' | 'number',
	string
> = {
	text: 'Введите ответ',
	textarea: 'Введите развернутый ответ',
	email: 'Введите email',
	number: 'Введите число'
}

const FieldControl = (props: { field: FormField }) => {
	const { field } = props

	if (
		field.type === 'text' ||
		field.type === 'email' ||
		field.type === 'number'
	) {
		return (
			<Input
				className={styles.input}
				placeholder={field.config.placeholder ?? DEFAULT_PLACEHOLDERS[field.type]}
				readOnly
				tabIndex={-1}
			/>
		)
	}

	if (field.type === 'textarea') {
		return (
			<Textarea
				className={styles.textarea}
				placeholder={field.config.placeholder ?? DEFAULT_PLACEHOLDERS.textarea}
				readOnly
				tabIndex={-1}
			/>
		)
	}

	if (field.type === 'select') {
		return (
			<div className={styles.selectPreview}>
				<span>Выберите вариант</span>
				<ChevronDown size={18} aria-hidden='true' />
			</div>
		)
	}

	if (field.config.options.length === 0) {
		return <p className={styles.noOptions}>Варианты пока не добавлены</p>
	}

	return (
		<div className={styles.options}>
			{field.config.options.map(option => (
				<div className={styles.option} key={option.id}>
					<span
						className={clsx(
							styles.optionMarker,
							field.type === 'checkbox' && styles.checkboxMarker
						)}
						aria-hidden='true'
					/>
					<span>{option.label}</span>
				</div>
			))}
		</div>
	)
}

const FormFieldPreview = (props: FormFieldPreviewProps) => {
	const { field, formId, isDisabled, isDirty, isSelected, onSelect } = props

	return (
		<article
			className={clsx(styles.field, isSelected && styles.isSelected)}
			aria-disabled={isDisabled}
		>
			<button
				className={styles.selectButton}
				type='button'
				aria-label={`Редактировать поле «${field.label}»`}
				aria-pressed={isSelected}
				disabled={isDisabled}
				onClick={() => onSelect(field.id)}
			/>

			<GripVertical
				className={styles.dragHandle}
				size={20}
				aria-hidden='true'
			/>

			<div className={styles.content}>
				<div className={styles.meta}>
					<span className={styles.typeBadge}>
						{FIELD_TYPE_LABELS[field.type]}
					</span>
					{isDirty && (
						<span
							className={styles.dirtyIndicator}
							title='Есть несохранённые изменения'
							aria-label='Есть несохранённые изменения'
						/>
					)}
				</div>

				<div className={styles.fieldBody}>
					<p className={styles.label}>
						{field.label}
						{field.required && (
							<span className={styles.required} aria-label='обязательное поле'>
								*
							</span>
						)}
					</p>
					{field.description && (
						<p className={styles.description}>{field.description}</p>
					)}
					<FieldControl field={field} />
				</div>
			</div>

			<DeleteFormFieldButton
				className={styles.deleteControl}
				fieldId={field.id}
				fieldLabel={field.label}
				formId={formId}
			/>
		</article>
	)
}

export { FormFieldPreview }
