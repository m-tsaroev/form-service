import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './Card.module.scss'
import type { CardProps, CardSeparatorProps } from './Card.types'

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
	const { className, ...rest } = props

	return <div ref={ref} className={clsx(className, styles.card)} {...rest} />
})
Card.displayName = 'Card'

const CardSeparator = forwardRef<HTMLDivElement, CardSeparatorProps>(
	(props, ref) => {
		const { className, orientation = 'horizontal', ...rest } = props

		return (
			<div
				ref={ref}
				className={clsx(styles.separator, styles[orientation], className)}
				role='separator'
				aria-orientation={orientation}
				{...rest}
			/>
		)
	}
)
CardSeparator.displayName = 'CardSeparator'

export { Card, CardSeparator }
