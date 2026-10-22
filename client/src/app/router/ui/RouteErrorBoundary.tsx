import { Link, isRouteErrorResponse, useRouteError } from 'react-router'

const RouteErrorBoundary = () => {
	const error = useRouteError()

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return (
				<main>
					<h1>Ничего не найдено</h1>
					<p>Страница или форма не существует.</p>
					<Link to='/'>Вернуться на главную</Link>
				</main>
			)
		}

		return (
			<main>
				<h1>Ошибка {error.status}</h1>
				<p>Не удалось выполнить запрос. Попробуйте обновить страницу.</p>
				<Link to='/'>Вернуться на главную</Link>
			</main>
		)
	}

	if (error instanceof Error) {
		console.error(error)

		return (
			<main>
				<h1>Что-то пошло не так</h1>
				<p>Произошла непредвиденная ошибка. Попробуйте обновить страницу.</p>
				<Link to='/'>Вернуться на главную</Link>
			</main>
		)
	}

	return (
		<main>
			<h1>Что-то пошло не так</h1>
			<Link to='/'>Вернуться на главную</Link>
		</main>
	)
}

export { RouteErrorBoundary }
