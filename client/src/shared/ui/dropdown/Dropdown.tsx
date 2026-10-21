import clsx from 'clsx'
import { Check, ChevronDown, ChevronRight, Circle } from 'lucide-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

import styles from './Dropdown.module.scss'
import type {
	DropdownCheckboxItemProps,
	DropdownContentProps,
	DropdownItemProps,
	DropdownLabelProps,
	DropdownProps,
	DropdownRadioGroupProps,
	DropdownRadioItemProps,
	DropdownSeparatorProps,
	DropdownSubContentProps,
	DropdownSubProps,
	DropdownSubTriggerProps,
	DropdownTriggerProps
} from './Dropdown.types'

const Dropdown = (props: DropdownProps) => (
	<DropdownMenuPrimitive.Root {...props} />
)

type DropdownTriggerExtraProps = {
	showIcon?: boolean
}

const DropdownTrigger = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Trigger>,
	DropdownTriggerProps & DropdownTriggerExtraProps
>(({ className, children, showIcon = true, asChild, ...props }, ref) => {
	if (asChild) {
		return (
			<DropdownMenuPrimitive.Trigger
				ref={ref}
				className={className}
				asChild
				{...props}
			>
				{children}
			</DropdownMenuPrimitive.Trigger>
		)
	}

	return (
		<DropdownMenuPrimitive.Trigger
			ref={ref}
			className={clsx(styles.trigger, className)}
			{...props}
		>
			{children}
			{showIcon && (
				<ChevronDown className={styles.triggerIcon} aria-hidden='true' />
			)}
		</DropdownMenuPrimitive.Trigger>
	)
})
DropdownTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName

const DropdownContent = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Content>,
	DropdownContentProps
>(({ className, sideOffset = 8, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			className={clsx(styles.content, className)}
			sideOffset={sideOffset}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
))
DropdownContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownItem = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Item>,
	DropdownItemProps
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={clsx(styles.item, className)}
		{...props}
	/>
))
DropdownItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownCheckboxItem = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	DropdownCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={clsx(styles.checkboxItem, className)}
		checked={checked}
		{...props}
	>
		<span className={styles.indicator} aria-hidden='true'>
			{checked ? <Check size={16} strokeWidth={2} /> : null}
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
))
DropdownCheckboxItem.displayName =
	DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownRadioGroup = (props: DropdownRadioGroupProps) => (
	<DropdownMenuPrimitive.RadioGroup {...props} />
)

const DropdownRadioItem = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	DropdownRadioItemProps
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={clsx(styles.radioItem, className)}
		{...props}
	>
		<span className={styles.indicator} aria-hidden='true'>
			<DropdownMenuPrimitive.ItemIndicator>
				<Circle size={8} fill='currentColor' strokeWidth={0} />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
))
DropdownRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownLabel = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Label>,
	DropdownLabelProps
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={clsx(styles.label, className)}
		{...props}
	/>
))
DropdownLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownSeparator = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.Separator>,
	DropdownSeparatorProps
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={clsx(styles.separator, className)}
		{...props}
	/>
))
DropdownSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownSub = (props: DropdownSubProps) => (
	<DropdownMenuPrimitive.Sub {...props} />
)

const DropdownSubTrigger = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	DropdownSubTriggerProps
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={clsx(styles.subTrigger, className)}
		{...props}
	>
		{children}
		<ChevronRight
			className={styles.subTriggerIcon}
			aria-hidden='true'
			size={16}
		/>
	</DropdownMenuPrimitive.SubTrigger>
))
DropdownSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownSubContent = forwardRef<
	ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	DropdownSubContentProps
>(({ className, sideOffset = 8, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.SubContent
			ref={ref}
			className={clsx(styles.subContent, className)}
			sideOffset={sideOffset}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
))
DropdownSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownShortcut = ({
	className,
	...props
}: ComponentPropsWithoutRef<'span'>) => (
	<span className={clsx(styles.shortcut, className)} {...props} />
)

export {
	Dropdown,
	DropdownCheckboxItem,
	DropdownContent,
	DropdownItem,
	DropdownLabel,
	DropdownRadioGroup,
	DropdownRadioItem,
	DropdownSeparator,
	DropdownShortcut,
	DropdownSub,
	DropdownSubContent,
	DropdownSubTrigger,
	DropdownTrigger
}
