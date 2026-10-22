import { Outlet } from 'react-router'

import { Header } from '@/widgets/header'

const RootLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	)
}

export { RootLayout }
