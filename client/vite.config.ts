import { URL, fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@app': fileURLToPath(new URL('./src/app', import.meta.url)),
			'@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
			'@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
		}
	},
	server: {
		port: 5173,
		proxy: {
			'/api': 'http://localhost:3000'
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@shared/styles/helpers" as *;\n`
			}
		}
	}
})
