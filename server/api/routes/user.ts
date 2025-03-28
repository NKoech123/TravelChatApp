import { FastifyInstance } from 'fastify'

import { userService } from '@nicholas/services'
import { usersSchema } from '@nicholas/schema'

export default async function user(fastify: FastifyInstance) {
    fastify.route({
        method: 'POST',
        url: '/api/users',
        handler: upsertUsers,
        schema: {
            description: 'Fetches all users',
            body: usersSchema,
            response: {
                200: usersSchema,
            },
        },
    })

    async function upsertUsers(req, reply) {
        const response = await userService.upsertUsers(req.body)
        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send(response)
    }
}
