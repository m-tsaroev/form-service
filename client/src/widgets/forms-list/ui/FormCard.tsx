import { Card } from '@shared/ui'
import clsx from 'clsx'
import { Clock3, FileText, Users } from 'lucide-react'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'

import { FormActionsMenu } from '@/features/delete-form'

import type { FormCardProps } from './FormCard.types'
import styles from './FormsList.module.scss'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

const getAnswerLabel = (count: number) => {
	const lastTwoDigits = count % 100
	const lastDigit = count % 10

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'ответов'
	}

	if (lastDigit === 1) {
		return 'ответ'
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'ответа'
	}

	return 'ответов'
}

const FormCard = (props: FormCardProps) => {
	const { form } = props
	const statusLabel = form.status === 'published' ? 'Опубликована' : 'Черновик'

	return (
		<Card className={styles.card}>
			<Link
				className={styles.cardLink}
				to={ROUTES.SUBMISSIONS(form.id)}
				aria-label={`Открыть ответы формы «${form.title}»`}
			>
				<div className={styles.cardIcon} aria-hidden='true'>
					<FileText size={22} />
				</div>

				<div className={styles.cardContent}>
					<h2 className={styles.cardTitle}>{form.title}</h2>
					{form.description && (
						<p className={styles.cardDescription}>{form.description}</p>
					)}
				</div>

				<span
					className={clsx(
						styles.status,
						form.status === 'published'
							? styles.statusPublished
							: styles.statusDraft
					)}
				>
					{statusLabel}
				</span>

				<div className={styles.cardMeta}>
					<span className={styles.metaItem}>
						<Users size={18} aria-hidden='true' />
						{form.submissionCount} {getAnswerLabel(form.submissionCount)}
					</span>
					<span className={styles.metaItem}>
						<Clock3 size={18} aria-hidden='true' />
						Обновлено {dateFormatter.format(new Date(form.updatedAt))}
					</span>
				</div>
			</Link>

			<FormActionsMenu
				formId={form.id}
				formTitle={form.title}
				submissionCount={form.submissionCount}
			/>
		</Card>
	)
}

export { FormCard }
