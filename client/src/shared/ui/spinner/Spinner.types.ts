import type { HTMLAttributes } from 'react'

export type SpinnerProps = Omit<
	HTMLAttributes<HTMLSpanElement>,
	'aria-label'
> & {
	size?: 'sm' | 'md' | 'lg'
	label?: string
}
