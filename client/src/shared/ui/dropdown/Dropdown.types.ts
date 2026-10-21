import type { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'

export type DropdownProps = React.ComponentProps<
	typeof DropdownMenuPrimitive.Root
>
export type DropdownTriggerProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Trigger
>
export type DropdownContentProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Content
>
export type DropdownItemProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Item
>
export type DropdownCheckboxItemProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.CheckboxItem
>
export type DropdownRadioGroupProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.RadioGroup
>
export type DropdownRadioItemProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.RadioItem
>
export type DropdownLabelProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Label
>
export type DropdownSeparatorProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.Separator
>
export type DropdownSubProps = React.ComponentProps<
	typeof DropdownMenuPrimitive.Sub
>
export type DropdownSubTriggerProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.SubTrigger
>
export type DropdownSubContentProps = React.ComponentPropsWithoutRef<
	typeof DropdownMenuPrimitive.SubContent
>
