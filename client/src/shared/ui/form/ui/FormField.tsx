import clsx from 'clsx'
import { type FieldValues, useFormContext, useFormState } from 'react-hook-form'

import type { FormFieldProps } from './Form.types'

import { getError } from '../utils/getError'

import styles from './Form.module.scss'

const FormField = <T extends FieldValues>(props: FormFieldProps<T>) => {
	const { name, label, className, children, isRequired } = props

	const { control } = useFormContext<T>()
	const { errors } = useFormState({ control, name })

	const error = getError(errors, name)
	const fieldId = String(name).replaceAll('.', '-')

	return (
		<div className={clsx(styles.formField, className)}>
			<label htmlFor={fieldId} className={styles.label}>
				{label}
				{isRequired && <span className={styles.required}>*</span>}
			</label>
			<div className={styles.control}>{children}</div>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	)
}

export { FormField }
