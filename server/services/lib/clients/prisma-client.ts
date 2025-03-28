import { PrismaClient } from '@prisma/client'
import { logger } from '../../../log-utils'

const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
})

prisma.$on('query', event => {
    if (process.env.TURN_OFF_PRISMA_LOGGING !== 'true') {
        logger.log(event, 'Prisma Query')
    }
})

prisma.$on('error', event => {
    if (process.env.TURN_OFF_PRISMA_LOGGING !== 'true') {
        logger.error(event, 'Prisma Error')
    }
})

prisma.$on('info', event => {
    if (process.env.TURN_OFF_PRISMA_LOGGING !== 'true') {
        logger.log(event, 'Prisma Info')
    }
})

prisma.$on('warn', event => {
    if (process.env.TURN_OFF_PRISMA_LOGGING !== 'true') {
        logger.log(event, 'Prisma Warn')
    }
})

export default prisma
