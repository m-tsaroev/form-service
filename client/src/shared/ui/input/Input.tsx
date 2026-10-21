import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './Input.module.scss'
import type { InputProps } from './Input.types'

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	return (
		<input
			{...props}
			ref={ref}
			className={clsx(styles.input, props.className)}
		/>
	)
})

Input.displayName = 'Input'

export { Input }
