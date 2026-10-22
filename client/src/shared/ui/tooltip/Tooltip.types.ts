import type { Tooltip as TooltipPrimitive } from 'radix-ui'

export type TooltipProviderProps = React.ComponentProps<
	typeof TooltipPrimitive.Provider
>
export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Trigger
>
export type TooltipContentProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Content
>
