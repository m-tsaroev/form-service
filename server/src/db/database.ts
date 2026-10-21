import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Database from 'better-sqlite3'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const dataDirectory = path.resolve(currentDirectory, '../../../data')
const databasePath = process.env.DATABASE_PATH
	? path.resolve(process.env.DATABASE_PATH)
	: path.join(dataDirectory, 'app.db')

fs.mkdirSync(path.dirname(databasePath), { recursive: true })

const database = new Database(databasePath)

database.pragma('foreign_keys = ON')
database.pragma('journal_mode = WAL')

export { database, databasePath }
