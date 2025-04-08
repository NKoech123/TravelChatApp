import OpenAI from 'openai'
import { isWithinTokenLimit } from 'gpt-tokenizer'
import { logger } from '@nicholas/log-utils'
import { chatService } from './chat-service'
import prisma from './clients/prisma-client'
import { MessagesSchema } from '@/server/data-model/types/src/generated/generated'
import { OutputChipsSchema } from '@nicholas/types'

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

    async generateChipsFromMessages(chatId: string, existingChips?: string[]): Promise<OutputChipsSchema> {
        const messages = await chatService.getChatMessages(chatId) as MessagesSchema
        const messageContent = messages.messages.map((m) => m.content).join('\n')

        const chat = await chatService.getChat(chatId)

        const aiRequestMessages: OpenAI.Chat.ChatCompletionMessageParam[] = []

        const instructions = `
You are to extract exactly 10 short, unique, descriptive phrases from the following chat messages.
Return them inside a valid JSON object in the following format:
{ "chips": ["phrase 1", "phrase 2", ..., "phrase 10"] }

If there are no messages, make up phrases about what the user might want to explore in a new place
${chat?.title || 'Travel Planning'} with the following description:
${chat?.description || 'General travel assistance'}

If there are existing chips, make sure to exclude them from the output. Find new phrases that are not in the existing chips.

Only output the raw JSON — do NOT include code blocks (like triple backticks), explanations, or any formatting.
    `

        this.addDefaultSystemMessages(aiRequestMessages)

        aiRequestMessages.push({ role: 'user', content: instructions })
        aiRequestMessages.push({ role: 'user', content: `Chat messages:\n${messageContent}` })

        const response = await this.callOpenAI(aiRequestMessages)

        let raw = response.trim()

        // Strip Markdown code block formatting if present
        if (raw.startsWith('```')) {
            raw = raw.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '').trim()
        }

        logger.log('raw chips', raw)

        try {
            const parsed = JSON.parse(raw)
            if (!parsed?.chips || !Array.isArray(parsed.chips)) {
                throw new Error('Parsed JSON does not contain a "chips" array')
            }

            logger.log('parsed chips', parsed.chips)

            return { chatId, chips: parsed.chips }
        } catch (err) {
            logger.error('Failed to parse AI response:', raw)
            throw new Error('Invalid JSON response from AI')
        }
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
