'use client'

import clsx from 'clsx'
import { forwardRef } from 'react'

import styles from './Button.module.scss'
import type { ButtonProps } from './Button.types'

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const {
		title,
		onClick,
		className,
		variant = 'primary',
		size = 'md',
		disabled,
		isLoading,
		type,
		onlyIcon,
		ariaLabel,
		children,
		...rest
	} = props

	return (
		<button
			ref={ref}
			className={clsx(
				styles.button,
				className,
				(disabled || isLoading) && styles.disabled,
				onlyIcon && styles.onlyIcon,
				{
					[styles[variant]]: !!variant,
					[styles[size]]: !!size
				}
			)}
			title={title ?? (onlyIcon ? ariaLabel : undefined)}
			aria-label={onlyIcon ? ariaLabel : undefined}
			onClick={onClick}
			disabled={isLoading || disabled}
			type={type}
			{...rest}
		>
			{children}
		</button>
	)
})

Button.displayName = 'Button'

export { Button }
