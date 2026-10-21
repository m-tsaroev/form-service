import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './Textarea.module.scss'
import type { TextareaProps } from './Textarea.types'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(props, ref) => {
		return (
			<textarea
				{...props}
				ref={ref}
				className={clsx(styles.textarea, props.className)}
			/>
		)
	}
)

Textarea.displayName = 'Textarea'

export { Textarea }
