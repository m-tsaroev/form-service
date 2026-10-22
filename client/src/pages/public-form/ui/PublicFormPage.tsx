import { Spinner } from '@shared/ui'
import { useParams } from 'react-router'

import { usePublicFormQuery } from '@/entities/form'
import { PublicForm } from '@/widgets/public-form'

import styles from './PublicFormPage.module.scss'

const PublicFormPage = () => {
	const params = useParams()
	const slug = params.slug ?? ''
	const { data: form, error, isPending } = usePublicFormQuery(slug)

	if (isPending) {
		return (
			<main className={styles.state}>
				<Spinner size='lg' />
			</main>
		)
	}

	if (error?.error.code === 'FORM_NOT_FOUND') {
		return (
			<main className={styles.state}>
				<h1>Форма не найдена</h1>
				<p>Проверьте ссылку или обратитесь к автору формы.</p>
			</main>
		)
	}

	if (!form || error) {
		return (
			<main className={styles.state} role='alert'>
				<h1>Не удалось загрузить форму</h1>
				<p>Попробуйте обновить страницу позже.</p>
			</main>
		)
	}

	return (
		<main className={styles.page}>
			<PublicForm form={form} slug={slug} />
		</main>
	)
}

export { PublicFormPage }
