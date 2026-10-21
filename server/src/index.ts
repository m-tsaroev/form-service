import 'dotenv/config'

import { createApp } from '@server/app.js'
import { databasePath } from '@server/db/database.js'
import { runMigrations } from '@server/db/migrate.js'

const port = Number(process.env.PORT) || 3000

runMigrations()
const app = createApp()

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
	console.log(`Database: ${databasePath}`)
})
