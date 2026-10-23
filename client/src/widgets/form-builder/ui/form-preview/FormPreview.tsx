import { FormFieldPreview } from '../form-field-preview/FormFieldPreview'

import styles from './FormPreview.module.scss'
import type { FormPreviewProps } from './FormPreview.types'

const FormPreview = (props: FormPreviewProps) => {
	const {
		activePageId,
		dirtyFieldIds,
		form,
		isDisabled,
		onFieldSelect,
		selectedFieldId
	} = props
	const activePage = form.pages.find(page => page.id === activePageId)
	const pageIndex = form.pages.findIndex(page => page.id === activePageId)
	const fields = activePage?.fields ?? []

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
					<div className={styles.fields}>
						{fields.map(field => (
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
				) : (
					<p className={styles.empty}>
						Добавьте первое поле на эту страницу с помощью панели слева
					</p>
				)}
			</div>
		</section>
	)
}

export { FormPreview }
