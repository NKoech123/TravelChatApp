import {
    MessagesSchema,
    MessageSchema,
    ChatSchema,
    ChatsSchema,
    UserContextSchema,
    ChatRecordSchema,
    ChatInputsSchema,
} from '../../../server/data-model/types/src'
import prisma from './clients/prisma-client'
import { Prisma } from '@prisma/client'
import { prismaErrorHandler } from './clients/prisma-error-handler'
import { logger } from '../../log-utils'
import { getRequestContext } from './user-server-context'

import { llmService } from './llm-service'

class ChatService {
    async getUserChats(): Promise<ChatsSchema> {
        const userContext = getRequestContext() as UserContextSchema

        const result: ChatsSchema = { chats: [] }

        const chats = await prisma.chat.findMany({
            where: {
                userId: userContext.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        })
        result.chats = chats.map(chat => ({
            ...chat,
            description: chat.description || '',
            timestamp:
                chat.updatedAt.toISOString() || chat.createdAt.toISOString(),
        }))
        return result
    }

    async getChat(id: string): Promise<ChatSchema> {
        const userContext = getRequestContext()
        try {
            const chat = await prisma.chat.findFirst({
                where: {
                    id,
                    userId: userContext.id,
                },
            })

            if (!chat) {
                throw new Error('Chat not found')
            }

            return {
                ...chat,
                description: chat.description || '',
                timestamp:
                    chat.updatedAt.toISOString() ||
                    chat.createdAt.toISOString(),
            }
        } catch (e: any) {
            logger.error('Error getting chat:', e)
            throw e
        }
    }

    async upsertChat(chat: ChatSchema): Promise<ChatSchema> {
        const userContext = getRequestContext()
        if (!chat.userId) {
            // for standard data, we need to set the userId
            chat.userId = userContext.id ?? ''
        }

        let result = null
        try {
            if (chat.id) {
                result = await prisma.chat.update({
                    where: { id: chat.id },
                    data: chat as Prisma.ChatUpdateInput,
                })
            } else {
                result = await prisma.chat.create({
                    data: chat as Prisma.ChatCreateInput,
                })
            }

            return {
                id: result.id,
                title: result.title,
                description: result.description,
                timestamp:
                    result.updatedAt.toISOString() ||
                    result.createdAt.toISOString(),
            } as ChatSchema
        } catch (e: any) {
            logger.error('Error upserting chat:', e)
            return {
                error: prismaErrorHandler(e),
                ...chat,
                timestamp: new Date().toISOString(),
            }
        }
    }

    async upsertChats(chats: ChatSchema[]): Promise<ChatsSchema> {
        const results: ChatsSchema = { chats: [] }

        for (const chat of chats) {
            results.chats?.push(await this.upsertChat(chat))
        }
        return results
    }

    async getChatMessages(chatId: string) {
        const userContext = getRequestContext()

        try {
            const result: MessagesSchema = { messages: [] }
            const messages = await prisma.message.findMany({
                where: { chatId, userId: userContext.id },

                orderBy: {
                    createdAt: 'asc',
                },
            })
            for (const msg of messages) {
                result.messages.push({
                    ...msg,
                    timestamp: msg.createdAt.toISOString(),
                })
            }

            return result
        } catch (error: any) {
            logger.error(
                'Error fetching chat messages:',
                error?.message || error
            )
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return prismaErrorHandler(error)
            }
            throw error
        }
    }

    async upsertMessage(
        chatId: string,
        message: MessageSchema
    ): Promise<MessageSchema> {
        const userContext = getRequestContext()

        let messageForInsert = message

        messageForInsert.userId = userContext.id ?? ''
        messageForInsert.chatId = chatId

        if (messageForInsert.isAI && chatId) {
            const aiResponse = await llmService.generateLLMResponse(
                messageForInsert.content as string,
                chatId
            )
            messageForInsert.content = aiResponse
        }

        let result = null

        if (!messageForInsert.id) {
            result = await prisma.message.create({
                data: messageForInsert as Prisma.MessageCreateInput,
            })
        } else {
            result = await prisma.message.update({
                where: { id: messageForInsert.id },
                data: messageForInsert as Prisma.MessageUpdateInput,
            })
        }

        return {
            ...result,
            timestamp: result.createdAt.toISOString(),
        } as MessageSchema
    }

    async upsertChatMessages(
        chatId: string,
        messages: MessagesSchema
    ): Promise<MessagesSchema> {
        const results: MessagesSchema = { messages: [] }

        for (const msg of messages.messages ?? []) {
            results.messages?.push(await this.upsertMessage(chatId, msg))
        }

        return results
    }
}

export const chatService = new ChatService()
