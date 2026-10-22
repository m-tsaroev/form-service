import axios, { type CreateAxiosDefaults } from 'axios'

export type ApiError = {
	error: {
		code: string
		message: string
		details?: unknown
	}
}

const API_URL = import.meta.env.VITE_API_URL || '/api'

const options: CreateAxiosDefaults = {
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
}

export const apiAxios = axios.create(options)

apiAxios.interceptors.response.use(
	response => response,
	(error: unknown) => {
		if (!axios.isAxiosError<ApiError>(error)) {
			return Promise.reject(error)
		}

		if (error.response?.data) {
			return Promise.reject(error.response.data)
		}

		return Promise.reject({
			error: {
				code: 'NETWORK_ERROR',
				message: 'Не удалось связаться с сервером'
			}
		} satisfies ApiError)
	}
)
