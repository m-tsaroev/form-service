import clsx from 'clsx'
import { type PropsWithChildren, forwardRef } from 'react'
import { type FieldValues, FormProvider } from 'react-hook-form'

import { Card } from '@shared/ui'

import styles from './Form.module.scss'
import type { FormProps, FormTitleProps } from './Form.types'

const Form = <
	TFieldValues extends FieldValues,
	TTransformedValues extends FieldValues
>(
	props: PropsWithChildren<FormProps<TFieldValues, TTransformedValues>>
) => {
	const {
		align = 'start',
		children,
		className,
		form,
		onSubmit,
		title,
		isCustom = false,
		...rest
	} = props

	if (isCustom) {
		return (
			<FormProvider {...form}>
				<form
					className={clsx(styles.form, styles[align], className)}
					onSubmit={form.handleSubmit(onSubmit)}
					{...rest}
				>
					{title && <FormTitle>{title}</FormTitle>}
					{children}
				</form>
			</FormProvider>
		)
	}

	return (
		<FormProvider {...form}>
			<Card className={styles.container}>
				<form
					className={clsx(styles.form, styles[align], className)}
					onSubmit={form.handleSubmit(onSubmit)}
					{...rest}
				>
					{title && <FormTitle>{title}</FormTitle>}
					{children}
				</form>
			</Card>
		</FormProvider>
	)
}

const FormTitle = forwardRef<HTMLHeadingElement, FormTitleProps>(
	(props, ref) => {
		const { className, ...rest } = props

		return <h2 ref={ref} className={clsx(styles.title, className)} {...rest} />
	}
)

FormTitle.displayName = 'FormTitle'

export { Form, FormTitle }
