import { FormFieldPreview } from '../form-field-preview/FormFieldPreview'

import styles from './FormPreview.module.scss'
import type { FormPreviewProps } from './FormPreview.types'

const FormPreview = (props: FormPreviewProps) => {
	const {
		dirtyFieldIds,
		form,
		isDisabled,
		onFieldSelect,
		selectedFieldId
	} = props
	const fields = form.pages.flatMap(page => page.fields)

	return (
		<section className={styles.panel} aria-labelledby='form-preview-title'>
			<div className={styles.heading}>
				<h2 className={styles.title} id='form-preview-title'>
					Предпросмотр формы
				</h2>
				<p className={styles.hint}>
					Выберите поле, чтобы изменить его настройки
				</p>
			</div>

			<div className={styles.canvas}>
				<div className={styles.formHeading}>
					<h3 className={styles.formTitle}>{form.title}</h3>
					{form.description && (
						<p className={styles.formDescription}>{form.description}</p>
					)}
				</div>

				{fields.length > 0 ? (
					<div className={styles.fields}>
						{fields.map(field => (
							<FormFieldPreview
								field={field}
								isDisabled={isDisabled}
								isDirty={dirtyFieldIds.has(field.id)}
								isSelected={field.id === selectedFieldId}
								onSelect={onFieldSelect}
								key={field.id}
							/>
						))}
					</div>
				) : (
					<p className={styles.empty}>
						Добавьте первое поле с помощью панели слева
					</p>
				)}
			</div>
		</section>
	)
}

export { FormPreview }
