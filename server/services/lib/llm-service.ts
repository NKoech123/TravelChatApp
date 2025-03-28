import openai from './clients/openai-client';
import OpenAI from 'openai';
import { isWithinTokenLimit } from './clients/openai-client';
import { logger } from '@nicholas/log-utils';


const GPT_MODEL = 'gpt-4o-mini';

interface ErrorWithMessage {
    message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

export interface ChatCompleteResponse {
    content: string | null;
    role: string;
}



const MAX_TOKENS = 120000;


export class LLMService {
    public async callOpenAI(
        messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        responseFormat: 'text' | 'json_object' = 'text',
    ): Promise<ChatCompleteResponse> {
        try {

            logger.log(messages, 'OpenAIMessages');

            const isWithinLimit = isWithinTokenLimit(
                JSON.stringify(messages),
                MAX_TOKENS
            );

            if (!isWithinLimit) {
                throw new Error('Message exceeds token limit');
            }

            const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] =
                [];


            let completion: OpenAI.Chat.Completions.ChatCompletion;
            const startTime = new Date().getTime();

            completion = await openai.chat.completions.create({
                messages,
                model: GPT_MODEL,
                response_format: { type: responseFormat },
                temperature: 0.1,
                tools: toolDefinitions.length ? toolDefinitions : undefined,
                tool_choice: toolDefinitions.length ? 'auto' : undefined,
            });

            const elapsedTimeOpenAI = new Date().getTime() - startTime;
            logger.log({ elapsedTimeOpenAI, completion }, 'OpenAI response');

            const { message, finish_reason } = completion.choices[0];

            if (!message.content) {
                throw new Error('No response content generated');
            }

            if (finish_reason === 'length') {
                logger.error(
                    { message },
                    'OpenAI response was truncated due to length'
                );
            }

            const response = {
                content: message.content,
                role: message.role,
            };

            return response;
        } catch (error) {
            logger.error(error, 'Error calling OpenAI');
            throw error;
        }
    }


    async generateTravelResponse(userMessage: string): Promise<string> {
        const response = await this.callOpenAI([
            {
                role: 'user',
                content: userMessage,
            },
        ]);

        if (!response.content) {
            throw new Error('No response content generated');
        }

        return response.content;
    }

}

export const llmService = new LLMService();
