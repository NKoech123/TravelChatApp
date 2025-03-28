import cors from '@fastify/cors'
import requestContext from '@fastify/request-context'
import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerui from '@fastify/swagger-ui'
import { userService } from '@nicholas/services'
import allroutes from './allroutes'
import { setUserContextValue } from '../services/lib/user-server-context'
import { UserContextSchema, UserSchema } from '../data-model/types/src'
import { logger } from '../log-utils'

const DEFAULT_USER_EMAIL = 'nicholask320@gmail.com'

const app = fastify({ trustProxy: true, logger: true, bodyLimit: 50000000 })

app.register(cors, {
    allowedHeaders: ['Authorization', 'Content-Type'],
})

app.register(requestContext, {
    hook: 'preValidation',
    defaultStoreValues: {
        requestContext: {},
        user: {} as UserSchema,
    },
})

app.addHook('preValidation', async (req, reply) => {
    try {
        const user = (await userService.getUserByEmail(
            DEFAULT_USER_EMAIL
        )) as UserSchema
        setUserContextValue(user)
    } catch (err: any) {
        logger.error('Error setting user context:', err)
    }
})

app.register(swagger, {
    swagger: {
        info: {
            title: 'Nicholas API',
            description: 'Nicholas Template APIs',
            version: '0.1.0',
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here',
        },
        host: 'localhost:3001',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [],
        definitions: {},
        securityDefinitions: {
            apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header',
            },
        },
    },
})

app.register(swaggerui, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
    uiHooks: {
        onRequest(request, reply, next) {
            next()
        },
        preHandler(request, reply, next) {
            next()
        },
    },
    staticCSP: true,
    transformStaticCSP: header => header,
    transformSpecification: swaggerObject => {
        return swaggerObject
    },
    transformSpecificationClone: true,
})

app.register(async app => {
    allroutes(app)
})

export default app
