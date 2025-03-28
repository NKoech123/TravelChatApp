import OpenAI from 'openai'
import { isWithinTokenLimit } from 'gpt-tokenizer'
import { logger } from '@nicholas/log-utils'
import { chatService } from './chat-service'
import prisma from './clients/prisma-client'

const SYSTEM_MESSAGES = [
    'You are a knowledgeable and friendly travel assistant.',
    'Provide accurate, helpful, and engaging travel advice.',
    'Focus on practical recommendations and local insights. Feel free to add links to relevant websites',
    'Keep responses concise but informative.',
    'Will provide chat context (title and description) to help with the response.',
]

const GPT_MODEL = 'gpt-4-turbo-preview'

interface ErrorWithMessage {
    message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    )
}

export interface ChatCompleteResponse {
    content: string | null
    role: string
}

export class LLMService {
    private openai: OpenAI

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })
    }

    private async callOpenAI(
        messages: OpenAI.Chat.ChatCompletionMessageParam[]
    ) {
        const completion = await this.openai.chat.completions.create({
            model: GPT_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
        })

        const responseContent = completion.choices[0]?.message?.content
        if (!responseContent) {
            throw new Error('No response content generated')
        }

        return responseContent
    }

    private addDefaultSystemMessages(
        aiRequestMessages: OpenAI.Chat.ChatCompletionMessageParam[]
    ) {
        aiRequestMessages.push({
            role: 'system',
            content: SYSTEM_MESSAGES.join('\n'),
        })
    }

    private async addUserChatContextMessages(
        aiRequestMessages: OpenAI.Chat.ChatCompletionMessageParam[],
        chatId: string
    ) {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { title: true, description: true },
        })

        const travelAssistantRole = `
                Current chat context:
                - Chat Title: ${chat?.title || 'Travel Planning'}
                - Chat Description: ${chat?.description || 'General travel assistance'}

                Your role is to:
                1. Provide personalized travel recommendations based on the chat context
                2. Give detailed, practical travel advice and tips
                3. Help create travel itineraries and plans
                4. Share cultural insights and local knowledge
                5. Suggest activities and attractions
                6. Answer travel-related questions clearly and concisely

                Keep responses friendly, informative, and focused on the current chat's context.`

        aiRequestMessages.push({
            role: 'system',
            content: travelAssistantRole,
        })
    }

    async generateLLMResponse(
        message: string,
        chatId: string
    ): Promise<string> {
        try {
            const aiRequestMessages: OpenAI.Chat.ChatCompletionMessageParam[] =
                []

            this.addDefaultSystemMessages(aiRequestMessages)

            await this.addUserChatContextMessages(aiRequestMessages, chatId)

            aiRequestMessages.push({
                role: 'user',
                content: `The user message is: ${message}`,
            })

            return await this.callOpenAI(aiRequestMessages)
        } catch (error: any) {
            logger.error('Error generating LLM response:', error)
            throw error
        }
    }
}

export const llmService = new LLMService()
