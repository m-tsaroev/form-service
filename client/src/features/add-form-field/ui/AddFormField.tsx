import {
	AlignLeft,
	Circle,
	Hash,
	Mail,
	SquareCheckBig,
	Type
} from 'lucide-react'

import { Button } from '@shared/ui'

import type { FormFieldType } from '../model/addFormField.types'
import { useAddFormField } from '../model/useAddFormField'

import styles from './AddFormField.module.scss'
import type { AddFormFieldProps } from './AddFormField.types'

const FIELD_TYPES = [
	{ type: 'text', label: 'Текст', Icon: Type },
	{ type: 'textarea', label: 'Абзац', Icon: AlignLeft },
	{ type: 'email', label: 'Email', Icon: Mail },
	{ type: 'number', label: 'Число', Icon: Hash },
	{ type: 'radio', label: 'Один вариант', Icon: Circle },
	{ type: 'checkbox', label: 'Несколько вариантов', Icon: SquareCheckBig }
] satisfies Array<{
	type: FormFieldType
	label: string
	Icon: typeof Type
}>

const AddFormField = (props: AddFormFieldProps) => {
	const { formId } = props
	const { addField, addingType, error, isPending } = useAddFormField(formId)

	return (
		<section className={styles.panel} aria-labelledby='add-field-title'>
			<h2 className={styles.title} id='add-field-title'>
				Добавить поле
			</h2>

			<div className={styles.list}>
				{FIELD_TYPES.map(item => {
					const { Icon } = item

					return (
						<Button
							className={styles.fieldButton}
							variant='secondary'
							type='button'
							disabled={isPending}
							isLoading={isPending && addingType === item.type}
							onClick={() => addField(item.type)}
							key={item.type}
						>
							<Icon size={21} strokeWidth={1.8} aria-hidden='true' />
							<span>{item.label}</span>
						</Button>
					)
				})}
			</div>

			{error && (
				<p className={styles.error} role='alert'>
					Не удалось добавить поле. Попробуйте ещё раз.
				</p>
			)}
		</section>
	)
}

export { AddFormField }
