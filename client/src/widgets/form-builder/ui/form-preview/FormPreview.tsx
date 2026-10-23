import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	type DropAnimation,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	defaultDropAnimationSideEffects,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useRef, useState } from 'react'

import type { FormField } from '@/entities/form'
import { useReorderFormFields } from '@/features/reorder-form-fields'

import {
	FormFieldDragOverlay,
	FormFieldPreview
} from '../form-field-preview/FormFieldPreview'

import styles from './FormPreview.module.scss'
import type { FormPreviewProps } from './FormPreview.types'

const DRAG_MODIFIERS = [restrictToVerticalAxis]
const DROP_ANIMATION: DropAnimation = {
	duration: 180,
	easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
	sideEffects: defaultDropAnimationSideEffects({
		styles: { active: { opacity: '0' } }
	})
}

const FormPreview = (props: FormPreviewProps) => {
	const {
		activePageId,
		dirtyFieldIds,
		form,
		isDisabled,
		onFieldSelect,
		selectedFieldId
	} = props

	const [draggedField, setDraggedField] = useState<FormField | null>(null)
	const [dragFieldIds, setDragFieldIds] = useState<number[] | null>(null)
	const dragFieldIdsRef = useRef<number[] | null>(null)

	const activePage = form.pages.find(page => page.id === activePageId)
	const pageIndex = form.pages.findIndex(page => page.id === activePageId)

	const fields = activePage?.fields ?? []
	const savedFieldIds = fields.map(field => field.id)
	const fieldIds = dragFieldIds ?? savedFieldIds
	const fieldsById = new Map(fields.map(field => [field.id, field]))
	const displayedFields = fieldIds.flatMap(fieldId => {
		const field = fieldsById.get(fieldId)
		return field ? [field] : []
	})

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 4 }
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const { error, reorderFields } = useReorderFormFields(form.id)
	const resetDragState = () => {
		dragFieldIdsRef.current = null
		setDragFieldIds(null)
		setDraggedField(null)
	}

	const handleDragStart = (event: DragStartEvent) => {
		dragFieldIdsRef.current = savedFieldIds
		setDragFieldIds(savedFieldIds)
		setDraggedField(
			fields.find(field => field.id === Number(event.active.id)) ?? null
		)
	}

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event
		const currentFieldIds = dragFieldIdsRef.current

		if (!over || active.id === over.id || !currentFieldIds) {
			return
		}

		const oldIndex = currentFieldIds.indexOf(Number(active.id))
		const newIndex = currentFieldIds.indexOf(Number(over.id))

		if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
			return
		}

		const nextFieldIds = arrayMove(currentFieldIds, oldIndex, newIndex)
		dragFieldIdsRef.current = nextFieldIds
		setDragFieldIds(nextFieldIds)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { over } = event
		const finalFieldIds = dragFieldIdsRef.current

		if (!activePage || !over || !finalFieldIds) {
			resetDragState()
			return
		}

		if (
			finalFieldIds.some((fieldId, index) => savedFieldIds[index] !== fieldId)
		) {
			dragFieldIdsRef.current = null
			setDraggedField(null)
			reorderFields({
				pageId: activePage.id,
				fieldIds: finalFieldIds
			})
			requestAnimationFrame(() => setDragFieldIds(null))
			return
		}

		resetDragState()
	}

	return (
		<section className={styles.panel} aria-labelledby='form-preview-title'>
			<div className={styles.heading}>
				<h2 className={styles.title} id='form-preview-title'>
					Предпросмотр формы
				</h2>
				<p className={styles.hint}>
					Выберите поле или настройте текущую страницу
				</p>
			</div>

			<div className={styles.canvas}>
				<div className={styles.formHeading}>
					<h3 className={styles.formTitle}>{form.title}</h3>
					{form.description && (
						<p className={styles.formDescription}>{form.description}</p>
					)}
				</div>

				{activePage && (
					<div className={styles.pageHeading}>
						<h4 className={styles.pageTitle}>
							{activePage.title ?? `Страница ${pageIndex + 1}`}
						</h4>
						{activePage.description && (
							<p className={styles.pageDescription}>{activePage.description}</p>
						)}
					</div>
				)}

				{fields.length > 0 ? (
					<DndContext
						collisionDetection={closestCenter}
						modifiers={DRAG_MODIFIERS}
						sensors={sensors}
						onDragCancel={resetDragState}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDragStart={handleDragStart}
					>
						<SortableContext
							items={fieldIds}
							strategy={verticalListSortingStrategy}
						>
							<div className={styles.fields}>
								{displayedFields.map(field => (
									<FormFieldPreview
										field={field}
										formId={form.id}
										isDisabled={isDisabled}
										isDirty={dirtyFieldIds.has(field.id)}
										isSelected={field.id === selectedFieldId}
										onSelect={onFieldSelect}
										key={field.id}
									/>
								))}
							</div>
						</SortableContext>

						<DragOverlay adjustScale={false} dropAnimation={DROP_ANIMATION}>
							{draggedField ? (
								<FormFieldDragOverlay
									field={draggedField}
									isDirty={dirtyFieldIds.has(draggedField.id)}
								/>
							) : null}
						</DragOverlay>
					</DndContext>
				) : (
					<p className={styles.empty}>
						Добавьте первое поле на эту страницу с помощью панели слева
					</p>
				)}

				{error && (
					<p className={styles.reorderError} role='alert'>
						Не удалось изменить порядок полей
					</p>
				)}
			</div>
		</section>
	)
}

export { FormPreview }
