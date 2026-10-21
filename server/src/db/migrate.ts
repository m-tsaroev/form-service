import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { database } from './database.js'

type AppliedMigrationRow = {
	name: string
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const migrationsDirectory = path.join(currentDirectory, 'migrations')

const runMigrations = () => {
	database.exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			name TEXT PRIMARY KEY,
			applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`)

	const appliedMigrations = new Set(
		database
			.prepare<[], AppliedMigrationRow>('SELECT name FROM schema_migrations')
			.all()
			.map(migration => migration.name)
	)

	const migrationFiles = fs
		.readdirSync(migrationsDirectory)
		.filter(fileName => /^\d+.*\.sql$/.test(fileName))
		.sort()

	const applyMigration = database.transaction((name: string, sql: string) => {
		database.exec(sql)
		database
			.prepare('INSERT INTO schema_migrations (name) VALUES (?)')
			.run(name)
	})

	for (const fileName of migrationFiles) {
		if (appliedMigrations.has(fileName)) {
			continue
		}

		const filePath = path.join(migrationsDirectory, fileName)
		const sql = fs.readFileSync(filePath, 'utf8')

		applyMigration(fileName, sql)
		console.log(`Applied migration: ${fileName}`)
	}
}

export { runMigrations }
