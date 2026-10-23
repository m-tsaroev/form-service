import { useParams } from 'react-router'

import { SubmissionsDashboard } from '@/widgets/submissions-dashboard'

const SubmissionsPage = () => {
	const { id } = useParams<{ id: string }>()

	return <SubmissionsDashboard formId={Number(id)} />
}

export { SubmissionsPage }
