import fs from 'fs'
import path from 'path'
import pkg from 'shelljs'
const { exec } = pkg
import { fileURLToPath } from 'url'
import { logger } from '../server/log-utils'

import { createStandardData } from '../server/data-model/standard-data'
;(async () => {
    logger.log('Starting Postgres Docker Image')

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const rootDirectory = path.join(__dirname, '../..') // Adjust this path

    if (
        !process.env.DATABASE_URL &&
        !fs.existsSync(path.join(rootDirectory, '.env'))
    ) {
        fs.writeFileSync(
            path.join(rootDirectory, '.env'),
            'DATABASE_URL="postgresql://postgresUser:postgresPW@localhost:5455/postgres?schema=public"'
        )
        process.env.DATABASE_URL =
            'postgresql://postgresUser:postgresPW@localhost:5455/postgres?schema=public'
    }

    const TASK_DB_NAME = 'taskPostgres'
    if (!process.env.SKIP_DOCKER_START) {
        exec(`docker run \
        --name ${TASK_DB_NAME} \
        -p 5455:5432 \
        -e POSTGRES_USER=postgresUser \
        -e POSTGRES_PASSWORD=postgresPW \
        -e POSTGRES_DB=postgres \
        -d postgres`)

        exec(`docker start ${TASK_DB_NAME}`)

        console.log('Waiting 5 seconds for Image to Start Successfully')
        await new Promise(resolve => setTimeout(resolve, 5000))
    }

    logger.log('Pushing Prisma DB and generating client')
    logger.log(`Root Directory ${rootDirectory}`)

    // Add explicit path to schema
    const schemaPath = path.join(rootDirectory, 'prisma', 'schema.prisma')
    exec(
        `cd ${rootDirectory} && npx prisma db push --schema=${schemaPath} --accept-data-loss`
    )
    exec(`cd ${rootDirectory} && npx prisma generate --schema=${schemaPath}`)

    await createStandardData.createStandardData()
})()
