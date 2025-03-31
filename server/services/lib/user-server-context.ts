import { requestContext } from '@fastify/request-context'
import { UserSchema } from '@nicholas/types'

declare module '@fastify/request-context' {
    interface RequestContextData {
        requestContext: object
        user: UserSchema
    }
}

export function setUserContextValue(userContext: UserSchema) {
    requestContext.set('user', userContext)
}

export function getRequestContext() {
    return requestContext.get('user') ?? {}
}
