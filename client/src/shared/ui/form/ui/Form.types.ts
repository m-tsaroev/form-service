import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import type {
	FieldPath,
	FieldValues,
	SubmitHandler,
	UseFormReturn
} from 'react-hook-form'

export type FormAlign = 'start' | 'center' | 'end'

export type FormProps<
	TFieldValues extends FieldValues,
	TTransformedValues extends FieldValues
> = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'title'> & {
	title?: ReactNode
	align?: FormAlign
	form: UseFormReturn<TFieldValues, unknown, TTransformedValues>
	onSubmit: SubmitHandler<TTransformedValues>
	isCustom?: boolean
}

export type FormTitleProps = HTMLAttributes<HTMLHeadingElement>

export type FormSectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
	title?: ReactNode
	description?: ReactNode
	align?: FormAlign
}

export type FormFieldProps<T extends FieldValues> = {
	name: FieldPath<T>
	label: string
	className?: string
	isRequired?: boolean
	children: ReactNode
}
