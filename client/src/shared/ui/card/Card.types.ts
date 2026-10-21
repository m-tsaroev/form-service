import type { HTMLAttributes } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement>

export type CardSeparatorProps = Omit<
	HTMLAttributes<HTMLDivElement>,
	'aria-orientation' | 'role'
> & {
	orientation?: 'horizontal' | 'vertical'
}
