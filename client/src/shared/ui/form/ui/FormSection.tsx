import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './Form.module.scss'
import type { FormSectionProps } from './Form.types'

const FormSection = forwardRef<HTMLElement, FormSectionProps>((props, ref) => {
	const {
		align = 'start',
		children,
		className,
		description,
		title,
		...rest
	} = props

	return (
		<section
			ref={ref}
			className={clsx(styles.section, styles[align], className)}
			{...rest}
		>
			{title && <h3 className={styles.sectionTitle}>{title}</h3>}
			{description && (
				<p className={styles.sectionDescription}>{description}</p>
			)}
			{children}
		</section>
	)
})

FormSection.displayName = 'FormSection'

export { FormSection }
