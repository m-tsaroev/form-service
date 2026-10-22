import clsx from 'clsx'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { forwardRef } from 'react'

import styles from './Tooltip.module.scss'
import type {
	TooltipContentProps,
	TooltipProps,
	TooltipProviderProps,
	TooltipTriggerProps
} from './Tooltip.types'

const TooltipProvider = (props: TooltipProviderProps) => (
	<TooltipPrimitive.Provider {...props} />
)

const Tooltip = (props: TooltipProps) => <TooltipPrimitive.Root {...props} />

const TooltipTrigger = forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Trigger>,
	TooltipTriggerProps
>((props, ref) => <TooltipPrimitive.Trigger ref={ref} {...props} />)
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	TooltipContentProps
>((props, ref) => {
	const { children, className, sideOffset = 8, ...rest } = props

	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				ref={ref}
				className={clsx(styles.content, className)}
				sideOffset={sideOffset}
				{...rest}
			>
				{children}
				<TooltipPrimitive.Arrow className={styles.arrow} />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
