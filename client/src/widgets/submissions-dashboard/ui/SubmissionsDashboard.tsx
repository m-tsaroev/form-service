import { Button, Card, Input, Spinner } from '@shared/ui'
import clsx from 'clsx'
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Clock3,
	Download,
	ExternalLink,
	ListChecks,
	Pencil,
	Search,
	Users
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/shared/config'

import { useFormQuery } from '@/entities/form'
import { type Submission, useSubmissionsQuery } from '@/entities/submission'

import {
	downloadSubmissionsCsv,
	formatDate,
	formatDateTime,
	getAnswerLabel,
	getFieldLabel,
	getFormFields,
	getSubmissionValue
} from '../lib/submissions-dashboard.utils'

import styles from './SubmissionsDashboard.module.scss'
import type { SubmissionsDashboardProps } from './SubmissionsDashboard.types'

const PAGE_SIZE = 6
const EMPTY_SUBMISSIONS: Submission[] = []

const SubmissionsDashboard = (props: SubmissionsDashboardProps) => {
	const { formId } = props

	const navigate = useNavigate()

	const [query, setQuery] = useState('')
	const [page, setPage] = useState(1)

	const formQuery = useFormQuery(formId)

	const submissionsQuery = useSubmissionsQuery(formId)

	const form = formQuery.data
	const submissions = submissionsQuery.data ?? EMPTY_SUBMISSIONS

	const fields = useMemo(() => (form ? getFormFields(form) : []), [form])
  
	const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')

	const filteredSubmissions = useMemo(() => {
		if (!normalizedQuery) {
			return submissions
		}

		return submissions.filter(submission => {
			const values = fields.map(field => getSubmissionValue(submission, field))
			values.push(formatDateTime(submission.createdAt))

			return values.some(value =>
				value.toLocaleLowerCase('ru-RU').includes(normalizedQuery)
			)
		})
	}, [fields, normalizedQuery, submissions])
	const pageCount = Math.max(
		1,
		Math.ceil(filteredSubmissions.length / PAGE_SIZE)
	)
	const currentPage = Math.min(page, pageCount)
	const pageStart = (currentPage - 1) * PAGE_SIZE
	const visibleSubmissions = filteredSubmissions.slice(
		pageStart,
		pageStart + PAGE_SIZE
	)

	if (!Number.isInteger(formId) || formId <= 0) {
		return (
			<div className={styles.state} role='alert'>
				<h1>Форма не найдена</h1>
				<p>Проверьте адрес страницы.</p>
			</div>
		)
	}

	if (formQuery.isPending || submissionsQuery.isPending) {
		return (
			<div className={styles.state}>
				<Spinner size='lg' />
			</div>
		)
	}

	if (formQuery.isError || submissionsQuery.isError || !form) {
		return (
			<div className={styles.state} role='alert'>
				<h1>Не удалось загрузить ответы</h1>
				<p>Попробуйте обновить страницу позже.</p>
			</div>
		)
	}

	const isPublished = form.status === 'published'
	const shownFrom = filteredSubmissions.length === 0 ? 0 : pageStart + 1
	const shownTo = Math.min(pageStart + PAGE_SIZE, filteredSubmissions.length)

	return (
		<main className={styles.page}>
			<div className={styles.container}>
				<Button
					className={styles.backButton}
					variant='ghost'
					onClick={() => navigate(ROUTES.ADMIN)}
				>
					<ArrowLeft size={18} aria-hidden='true' />
					Мои формы
				</Button>

				<header className={styles.header}>
					<div className={styles.heading}>
						<div className={styles.titleRow}>
							<h1 className={styles.title}>{form.title}</h1>
							<span
								className={clsx(
									styles.status,
									isPublished ? styles.published : styles.draft
								)}
							>
								{isPublished ? 'Опубликована' : 'Черновик'}
							</span>
						</div>
						<p className={styles.updatedAt}>
							Обновлено {formatDate(form.updatedAt)}
						</p>
					</div>

					<div className={styles.actions}>
						<Button
							variant='secondary'
							onClick={() => navigate(ROUTES.FORM_ID(form.id))}
						>
							<Pencil size={19} aria-hidden='true' />
							Редактировать
						</Button>
						<Button
							disabled={!isPublished || !form.slug}
							onClick={() => {
								if (form.slug) {
									window.open(
										ROUTES.PUBLIC_FORM(form.slug),
										'_blank',
										'noopener,noreferrer'
									)
								}
							}}
						>
							<ExternalLink size={19} aria-hidden='true' />
							Открыть форму
						</Button>
					</div>
				</header>

				<section className={styles.metrics} aria-label='Сводка по форме'>
					<Card className={styles.metric}>
						<span className={styles.metricIcon} aria-hidden='true'>
							<Users size={25} />
						</span>
						<div>
							<strong>{submissions.length}</strong>
							<span>{getAnswerLabel(submissions.length)}</span>
						</div>
					</Card>
					<Card className={styles.metric}>
						<span className={styles.metricIcon} aria-hidden='true'>
							<Clock3 size={25} />
						</span>
						<div>
							<strong>
								{submissions[0]
									? formatDateTime(submissions[0].createdAt)
									: 'Нет ответов'}
							</strong>
							<span>Последний ответ</span>
						</div>
					</Card>
					<Card className={styles.metric}>
						<span className={styles.metricIcon} aria-hidden='true'>
							<ListChecks size={25} />
						</span>
						<div>
							<strong>{fields.length}</strong>
							<span>{getFieldLabel(fields.length)} в форме</span>
						</div>
					</Card>
				</section>

				<Card className={styles.responses}>
					<h2>Ответы</h2>

					<div className={styles.toolbar}>
						<label className={styles.search}>
							<span className={styles.visuallyHidden}>Поиск по ответам</span>
							<Search size={20} aria-hidden='true' />
							<Input
								className={styles.searchInput}
								type='search'
								placeholder='Поиск по ответам'
								value={query}
								onChange={event => {
									setQuery(event.target.value)
									setPage(1)
								}}
							/>
						</label>
						<Button
							variant='secondary'
							disabled={submissions.length === 0}
							onClick={() =>
								downloadSubmissionsCsv(form.title, fields, submissions)
							}
						>
							<Download size={19} aria-hidden='true' />
							Экспорт CSV
						</Button>
					</div>

					<div className={styles.tableWrapper}>
						<table className={styles.table}>
							<thead>
								<tr>
									{fields.map(field => (
										<th key={field.id} scope='col'>
											{field.label}
										</th>
									))}
									<th scope='col'>Дата отправки</th>
								</tr>
							</thead>
							<tbody>
								{visibleSubmissions.map(submission => (
									<tr key={submission.id}>
										{fields.map(field => {
											const value = getSubmissionValue(submission, field)

											return (
												<td key={field.id} title={value}>
													{value}
												</td>
											)
										})}
										<td>{formatDateTime(submission.createdAt)}</td>
									</tr>
								))}
							</tbody>
						</table>
						{visibleSubmissions.length === 0 && (
							<div className={styles.empty}>
								<h3>
									{submissions.length === 0
										? 'Ответов пока нет'
										: 'Ответы не найдены'}
								</h3>
								<p>
									{submissions.length === 0
										? 'Новые отправки появятся здесь.'
										: 'Измените поисковый запрос.'}
								</p>
							</div>
						)}
					</div>

					<footer className={styles.pagination}>
						<span>
							Показано {shownFrom}–{shownTo} из {filteredSubmissions.length}
						</span>
						<div>
							<Button
								variant='secondary'
								onlyIcon
								ariaLabel='Предыдущая страница'
								disabled={currentPage === 1}
								onClick={() => setPage(currentPage - 1)}
							>
								<ChevronLeft size={20} aria-hidden='true' />
							</Button>
							<Button
								variant='secondary'
								onlyIcon
								ariaLabel='Следующая страница'
								disabled={currentPage === pageCount}
								onClick={() => setPage(currentPage + 1)}
							>
								<ChevronRight size={20} aria-hidden='true' />
							</Button>
						</div>
					</footer>
				</Card>
			</div>
		</main>
	)
}

export { SubmissionsDashboard }
