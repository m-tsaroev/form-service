import clsx from 'clsx'

import { CreateForm } from '@/features/create-form'
import { FormBuilderHeader } from '@/widgets/form-builder-header'

import styles from './FormCreatePage.module.scss'

const FormCreatePage = () => {
	return (
		<div className={styles.page}>
			<div className={clsx('container', styles.container)}>
				<FormBuilderHeader
					title='Создание формы'
					description='Укажите название и описание — поля добавим на следующем шаге'
				/>

				<CreateForm />
			</div>
		</div>
	)
}

export { FormCreatePage }
