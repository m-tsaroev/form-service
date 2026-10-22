import { Spinner } from '@shared/ui'
import clsx from 'clsx'
import { useParams } from 'react-router'

import { useFormQuery } from '@/entities/form'
import { FormBuilder } from '@/widgets/form-builder'
import { FormBuilderHeader } from '@/widgets/form-builder-header'

import styles from './FormEditorPage.module.scss'

const FormEditorPage = () => {
	const params = useParams()
	const formId = Number(params.id)
	const { data: form, isError, isPending } = useFormQuery(formId)

	if (isPending) {
		return (
			<div className={styles.state}>
				<Spinner size='lg' />
			</div>
		)
	}

	if (isError || !form) {
		return (
			<div className={styles.state} role='alert'>
				Не удалось загрузить форму.
			</div>
		)
	}

	return (
		<div className={styles.page}>
			<div className={clsx('container', styles.container)}>
				<FormBuilderHeader
					title={form.title}
					description='Настройте поля и опубликуйте форму'
					formId={form.id}
					slug={form.slug}
					status={form.status}
				/>

				<FormBuilder form={form} />
			</div>
		</div>
	)
}

export { FormEditorPage }
