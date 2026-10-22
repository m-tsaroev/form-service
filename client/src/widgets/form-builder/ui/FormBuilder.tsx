import { AddFormField } from '@/features/add-form-field'

import styles from './FormBuilder.module.scss'
import type { FormBuilderProps } from './FormBuilder.types'

const FormBuilder = (props: FormBuilderProps) => {
	const { formId } = props

	return (
		<div className={styles.grid}>
			<aside className={styles.sidebar}>
				<AddFormField formId={formId} />
			</aside>
		</div>
	)
}

export { FormBuilder }
