import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonBaseProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	'aria-label' | 'children' | 'type'
> & {
	type?: 'button' | 'submit'
	variant?: 'primary' | 'secondary' | 'ghost'
	isLoading?: boolean
	size?: 'sm' | 'md' | 'lg'
}

type TextButtonProps = {
	onlyIcon?: false
	ariaLabel?: never
	children: ReactNode
}

type IconButtonProps = {
	onlyIcon: true
	ariaLabel: string
	children: ReactNode
}

export type ButtonProps =
	(ButtonBaseProps & TextButtonProps) | (ButtonBaseProps & IconButtonProps)
