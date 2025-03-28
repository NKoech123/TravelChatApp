import { Prisma } from '@prisma/client'

export type PrismaError = Prisma.PrismaClientKnownRequestError | Error | unknown

export function prismaErrorHandler(e: PrismaError): string {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
            case 'P2002':
                return 'Unique constraint violation'
            case 'P2025':
                return 'Record not found'
            default:
                return `Database error: ${e.message}`
        }
    }

    if (e instanceof Error) {
        return `Unexpected error: ${e.message}`
    }

    return 'An unknown error occurred'
}
