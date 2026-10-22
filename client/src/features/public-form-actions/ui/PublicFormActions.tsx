import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	useToast
} from '@shared/ui'
import { Copy, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/shared/config'

import styles from './PublicFormActions.module.scss'
import type { PublicFormActionsProps } from './PublicFormActions.types'

const PublicFormActions = (props: PublicFormActionsProps) => {
	const { slug } = props
	const navigate = useNavigate()
	const { showToast } = useToast()
	const publicPath = ROUTES.PUBLIC_FORM(slug)
	const publicUrl = new URL(publicPath, window.location.origin).toString()

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(publicUrl)
			showToast({
				title: 'Ссылка скопирована',
				description: publicUrl
			})
		} catch {
			showToast({
				title: 'Не удалось скопировать ссылку',
				description: 'Скопируйте адрес опубликованной формы вручную.'
			})
		}
	}

	return (
		<div className={styles.actions}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='secondary'
						type='button'
						onlyIcon
						ariaLabel='Скопировать ссылку на форму'
						onClick={() => void handleCopy()}
					>
						<Copy size={18} aria-hidden='true' />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Скопировать публичную ссылку</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant='secondary'
						type='button'
						onlyIcon
						ariaLabel='Открыть опубликованную форму'
						onClick={() => navigate(publicPath)}
					>
						<ExternalLink size={18} aria-hidden='true' />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Открыть опубликованную форму</TooltipContent>
			</Tooltip>
		</div>
	)
}

export { PublicFormActions }
