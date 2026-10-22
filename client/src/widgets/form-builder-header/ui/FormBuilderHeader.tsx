import { Button } from '@shared/ui'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import { PublishFormButton } from '@/features/publish-form'

import styles from './FormBuilderHeader.module.scss'
import type { FormBuilderHeaderProps } from './FormBuilderHeader.types'

const FormBuilderHeader = (props: FormBuilderHeaderProps) => {
	const { description, formId, status, title } = props
	const navigate = useNavigate()

	return (
		<header className={styles.header}>
			<Button
				className={styles.backButton}
				variant='ghost'
				size='sm'
				type='button'
				onClick={() => navigate(-1)}
			>
				<ArrowLeft size={18} aria-hidden='true' />
				Назад
			</Button>

			<div className={styles.main}>
				<div className={styles.content}>
					<h1 className={styles.title}>{title}</h1>
					<p className={styles.description}>{description}</p>
				</div>

				{formId !== undefined && status !== undefined && (
					<PublishFormButton
						formId={formId}
						isPublished={status === 'published'}
					/>
				)}
			</div>
		</header>
	)
}

export { FormBuilderHeader }
