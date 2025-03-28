import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { chatService } from '../../services/lib/chat-service'
import { ChatInputSchema } from '@nicholas/types'
import { chatInputSchema, chatsSchema, messagesSchema } from '@nicholas/schema'

export default async function chatRoutes(fastify: FastifyInstance) {
    fastify.get('/api/chats', {
        schema: {
            response: {
                200: chatsSchema,
            },
        },
        handler: getUserChats,
    })


    fastify.post('/api/chats', {
        schema: {
            body: chatInputSchema,
            response: {
                200: chatsSchema,
            },
        },
        handler: upsertChat,
    })

    fastify.get('/api/chats/:chatId/messages', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    chatId: { type: 'string' },
                },
                required: ['chatId'],
            },
            response: {
                200: messagesSchema,
            },
        },
        handler: getChatMessages,
    })

    fastify.post('/api/chats/:chatId/messages', {
        schema: {
            body: messagesSchema,
            response: {
                200: messagesSchema,
            },
        },
        handler: upsertChatMessages,
    })
}


async function getUserChats(request: FastifyRequest, reply: FastifyReply) {
    const response = await chatService.getUserChats()
    return reply.send(response)
}

async function upsertChat(request: FastifyRequest<{
    Body: ChatInputSchema
}>, reply: FastifyReply) {
    const response = await chatService.upsertChat(request.body)
    return reply.send(response)
}

async function getChatMessages(request: FastifyRequest<{
    Params: { chatId: string }
}>, reply: FastifyReply) {
    const { chatId } = request.params
    const response = await chatService.getChatMessages(chatId)
    return reply.send(response)
}

async function upsertChatMessages(request: FastifyRequest<{
    Params: { chatId: string }
}>, reply: FastifyReply) {
    const { chatId } = request.params

    const response = await chatService.upsertChatMessages(chatId, request.body)
    return reply.send(response)
}