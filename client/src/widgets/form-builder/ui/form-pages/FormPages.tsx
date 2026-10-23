import { Button } from '@shared/ui'
import { FileText } from 'lucide-react'

import { AddFormPage } from '@/features/add-form-page'

import styles from './FormPages.module.scss'
import type { FormPagesProps } from './FormPages.types'

const FormPages = (props: FormPagesProps) => {
	const { activePageId, formId, isDisabled, onPageAdded, onPageSelect, pages } =
		props

	return (
		<section className={styles.panel} aria-labelledby='form-pages-title'>
			<h2 className={styles.title} id='form-pages-title'>
				Страницы
			</h2>

			<div className={styles.list}>
				{pages.map((page, index) => (
					<Button
						className={styles.pageButton}
						variant={page.id === activePageId ? 'primary' : 'secondary'}
						type='button'
						disabled={isDisabled}
						onClick={() => onPageSelect(page.id)}
						aria-current={page.id === activePageId ? 'page' : undefined}
						key={page.id}
					>
						<FileText size={18} aria-hidden='true' />
						<span>{page.title ?? `Страница ${index + 1}`}</span>
					</Button>
				))}
			</div>

			<div className={styles.addPage}>
				<AddFormPage
					formId={formId}
					nextPageNumber={pages.length + 1}
					onPageAdded={onPageAdded}
				/>
			</div>
		</section>
	)
}

export { FormPages }
