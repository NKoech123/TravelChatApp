import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { llmService } from '@/server/services/lib/llm-service'
import { inputChipsSchema, outputChipsSchema } from '@nicholas/schema'

export default async function llmRoutes(fastify: FastifyInstance) {
    fastify.post('/api/llm-encrich-chips', {
        schema: {
            description: 'Fetches all chips',
            body: inputChipsSchema,
            response: {
                200: outputChipsSchema,
            },
        },
        handler: getChips,
    })
}

async function getChips(
    req: FastifyRequest<{
        Body: { chatId: string, existingChips?: string[] }
    }>,
    reply: FastifyReply
) {

    const { chatId, existingChips } = req.body

    const response = await llmService.generateChipsFromMessages(chatId, existingChips)

    reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(response)
}
