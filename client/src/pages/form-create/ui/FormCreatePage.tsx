import { FormBuilderHeader } from '@/widgets/form-builder-header'

import styles from './FormCreatePage.module.scss'

const FormCreatePage = () => {
	return (
		<div className={styles.page}>
			<div className='container'>
				<FormBuilderHeader
					title='Новая форма'
					description='Настройте поля и опубликуйте форму'
				/>
			</div>
		</div>
	)
}

export { FormCreatePage }
