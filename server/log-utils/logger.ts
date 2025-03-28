import pino from 'pino'
const pinoLogger = pino()

let DISABLE_LOGGER = false

try {
    DISABLE_LOGGER = process.env['DISABLE_LOGGER'] === 'true'
} catch (e) {
    // Happens on Browser
}

export class Logger {
    currentLogger = pinoLogger

    addChild(childObject: object) {
        this.currentLogger = this.currentLogger.child(childObject)
    }

    log(messageObject: unknown, message?: string) {
        if (DISABLE_LOGGER) return

        if (typeof messageObject === 'object' && messageObject !== null) {
            this.currentLogger.info(messageObject, message || '')
        } else {
            this.currentLogger.info({ messageObject }, message || '')
        }
    }

    warn(messageObject: unknown, message?: string) {
        if (DISABLE_LOGGER) return

        if (typeof messageObject === 'object' && messageObject !== null) {
            this.currentLogger.warn(messageObject, message || '')
        } else {
            this.currentLogger.warn({ messageObject }, message || '')
        }
    }

    error(messageObject: unknown, message?: string) {
        if (DISABLE_LOGGER) return

        if (typeof messageObject === 'object' && messageObject !== null) {
            this.currentLogger.error(messageObject, `LoggedError: ${message}`)
        } else {
            this.currentLogger.error(
                { messageObject },
                `LoggedError: ${message}`
            )
        }
    }

    fatal(messageObject: unknown, message?: string) {
        if (DISABLE_LOGGER) return

        if (typeof messageObject === 'object' && messageObject !== null) {
            this.currentLogger.fatal(messageObject, `LoggedFatal: ${message}`)
        } else {
            this.currentLogger.fatal(
                { messageObject },
                `LoggedFatal: ${message}`
            )
        }
    }
}

export const logger = new Logger()
