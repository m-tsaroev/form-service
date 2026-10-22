import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
	Input,
	Spinner
} from '@shared/ui'
import { FilePlus2, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { ROUTES } from '@/shared/config'
import { useDebounce } from '@/shared/lib'

import { type FormStatus, useFormsQuery } from '@/entities/form'

import { FormCard } from './FormCard'
import styles from './FormsList.module.scss'

type StatusFilter = 'all' | FormStatus

const STATUS_LABELS: Record<StatusFilter, string> = {
	all: 'Все статусы',
	published: 'Опубликованные',
	draft: 'Черновики'
}

const FormsList = () => {
	const [query, setQuery] = useState('')
	const [status, setStatus] = useState<StatusFilter>('all')
	const debouncedQuery = useDebounce(query.trim(), 300)
	const { data: forms, isError, isPending } = useFormsQuery(debouncedQuery)
	const filteredForms = (forms ?? []).filter(form => {
		return status === 'all' || form.status === status
	})

	return (
		<main className={styles.page}>
			<div className={styles.container}>
				<header className={styles.header}>
					<div>
						<h1 className={styles.title}>Мои формы</h1>
						<p className={styles.subtitle}>
							Создавайте формы и просматривайте ответы
						</p>
					</div>

					<Link className={styles.createButton} to={ROUTES.FORM_CREATE}>
						<Plus size={20} aria-hidden='true' />
						Создать форму
					</Link>
				</header>

				<div className={styles.filters}>
					<label className={styles.search}>
						<span className={styles.visuallyHidden}>Поиск по названию</span>
						<Search size={20} aria-hidden='true' />
						<Input
							className={styles.searchInput}
							type='search'
							placeholder='Поиск по названию'
							value={query}
							onChange={event => setQuery(event.target.value)}
						/>
					</label>

					<Dropdown>
						<DropdownTrigger
							className={styles.statusFilter}
							aria-label='Фильтр по статусу'
						>
							{STATUS_LABELS[status]}
						</DropdownTrigger>
						<DropdownContent
							className={styles.statusFilterContent}
							align='start'
						>
							<DropdownItem onSelect={() => setStatus('all')}>
								Все статусы
							</DropdownItem>
							<DropdownItem onSelect={() => setStatus('published')}>
								Опубликованные
							</DropdownItem>
							<DropdownItem onSelect={() => setStatus('draft')}>
								Черновики
							</DropdownItem>
						</DropdownContent>
					</Dropdown>
				</div>

				{isPending && (
					<div className={styles.state}>
						<Spinner size='lg' />
					</div>
				)}

				{isError && (
					<div className={styles.state} role='alert'>
						<h2>Не удалось загрузить формы</h2>
						<p>Попробуйте обновить страницу позже.</p>
					</div>
				)}

				{forms && !isError && (
					<div className={styles.grid}>
						{filteredForms.map(form => (
							<FormCard form={form} key={form.id} />
						))}

						{query === '' && status === 'all' && (
							<Link className={styles.newCard} to={ROUTES.FORM_CREATE}>
								<span className={styles.newCardIcon}>
									<FilePlus2 size={26} aria-hidden='true' />
								</span>
								Новая форма
							</Link>
						)}
					</div>
				)}

				{forms &&
					filteredForms.length === 0 &&
					(query !== '' || status !== 'all') && (
						<div className={styles.state}>
							<h2>Формы не найдены</h2>
							<p>Измените поисковый запрос или фильтр.</p>
						</div>
					)}
			</div>
		</main>
	)
}

export { FormsList }
