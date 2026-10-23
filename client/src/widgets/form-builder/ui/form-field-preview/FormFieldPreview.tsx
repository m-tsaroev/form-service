import { useSortable } from '@dnd-kit/sortable'
import { Input, Textarea } from '@shared/ui'
import clsx from 'clsx'
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react'
import type { CSSProperties } from 'react'

import type { FormField } from '@/entities/form'
import { DeleteFormFieldButton } from '@/features/delete-form-field'

import styles from './FormFieldPreview.module.scss'
import type {
	FormFieldDragOverlayProps,
	FormFieldPreviewProps
} from './FormFieldPreview.types'

const SORTABLE_TRANSITION = {
	duration: 140,
	easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
}

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
				placeholder={
					field.config.placeholder ?? DEFAULT_PLACEHOLDERS[field.type]
				}
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

const renderFieldContent = (field: FormField, isDirty: boolean) => (
	<div className={styles.content}>
		<div className={styles.meta}>
			<span className={styles.typeBadge}>{FIELD_TYPE_LABELS[field.type]}</span>
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
)

const FormFieldDragOverlay = (props: FormFieldDragOverlayProps) => {
	const { field, isDirty } = props

	return (
		<article
			className={clsx(styles.field, styles.dragOverlay)}
			aria-hidden='true'
		>
			<span className={styles.dragHandle}>
				<GripVertical size={20} aria-hidden='true' />
			</span>
			{renderFieldContent(field, isDirty)}
			<span className={styles.deletePlaceholder}>
				<Trash2 size={18} aria-hidden='true' />
			</span>
		</article>
	)
}

const FormFieldPreview = (props: FormFieldPreviewProps) => {
	const { field, formId, isDisabled, isDirty, isSelected, onSelect } = props

	const {
		attributes,
		isDragging,
		listeners,
		setActivatorNodeRef,
		setNodeRef,
		transform,
		transition
	} = useSortable({
		id: field.id,
		disabled: isDisabled,
		transition: SORTABLE_TRANSITION
	})

	const sortableStyle: CSSProperties = {
		transform:
			!isDragging && transform
				? `translate3d(0, ${transform.y}px, 0)`
				: undefined,
		transition: isDragging ? 'none' : transition
	}

	return (
		<article
			className={clsx(
				styles.field,
				isSelected && styles.isSelected,
				isDragging && styles.isDragging
			)}
			data-form-field-id={field.id}
			aria-disabled={isDisabled}
			ref={setNodeRef}
			style={sortableStyle}
		>
			<button
				className={styles.selectButton}
				data-form-field-select
				type='button'
				aria-label={`Редактировать поле «${field.label}»`}
				aria-pressed={isSelected}
				disabled={isDisabled}
				onClick={() => onSelect(field.id)}
			/>

			<button
				className={styles.dragHandle}
				type='button'
				disabled={isDisabled}
				ref={setActivatorNodeRef}
				{...attributes}
				{...listeners}
				aria-label={`Изменить порядок поля «${field.label}»`}
			>
				<GripVertical size={20} aria-hidden='true' />
			</button>

			{renderFieldContent(field, isDirty)}

			<DeleteFormFieldButton
				className={styles.deleteControl}
				fieldId={field.id}
				fieldLabel={field.label}
				formId={formId}
			/>
		</article>
	)
}

export { FormFieldDragOverlay, FormFieldPreview }
