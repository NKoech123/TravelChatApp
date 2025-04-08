import { MessageSchema, MessagesSchema } from '@nicholas/types'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { fetchWrapper, apiDomain } from '../../../../client-utils'

interface MessagesState {
    messagesLoading: boolean
    messagesError: string
    messagesById: { [key: string]: MessageSchema }
}

const initialMessagesState: MessagesState = {
    messagesLoading: false,
    messagesError: '',
    messagesById: {},
}

export const getMessages = createAsyncThunk(
    'messages/getMessages',
    async (chatId: string) => {
        const respJson = await fetchWrapper({
            method: 'GET',
            url: `${apiDomain}/api/chats/${chatId}/messages`,
            requiresAccessToken: true,
        })

        for (const message of respJson.messages) {
            if (message.error) {
                throw new Error(message.error)
            }
        }
        return respJson.messages as MessageSchema[]
    }
)

export const upsertMessage = createAsyncThunk(
    'messages/upsertMessage',
    async (
        data: {
            message: MessageSchema
            chatId: string
            handleSuccess: (messages: MessageSchema[]) => void
        },
        { rejectWithValue }
    ) => {
        const { message, chatId, handleSuccess } = data

        try {
            const respJson = (await fetchWrapper({
                method: 'POST',
                url: `${apiDomain}/api/chats/${chatId}/messages`,
                requiresAccessToken: false,
                body: { messages: [message] },
            })) as MessagesSchema

            for (const message of respJson.messages ?? []) {
                if (message.error) {
                    throw new Error(message.error)
                }
            }

            handleSuccess(respJson.messages)
            return respJson.messages as MessageSchema[]
        } catch (error) {
            return rejectWithValue({
                errorMessage: `${error}`,
            })
        }
    }
)

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialMessagesState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getMessages.pending, (state: MessagesState) => {
            state.messagesById = {}
            state.messagesLoading = true
            state.messagesError = initialMessagesState.messagesError
        })

        builder.addCase(
            getMessages.fulfilled,
            (state: MessagesState, action: PayloadAction<MessageSchema[]>) => {
                state.messagesLoading = initialMessagesState.messagesLoading
                state.messagesError = ''

                const allMessages = action.payload as MessageSchema[]
                for (const message of allMessages) {
                    state.messagesById[message.id as string] = message
                }
            }
        )

        builder.addCase(getMessages.rejected, (state, action) => {
            state.messagesError = action.error.message as string
        })

        builder.addCase(
            upsertMessage.pending,
            (state: MessagesState, action) => {
                const { message } = action.meta.arg
                state.messagesError = initialMessagesState.messagesError
                if (!message.isAI) {
                    state.messagesLoading = true
                }
            }
        )

        builder.addCase(
            upsertMessage.fulfilled,
            (state: MessagesState, action) => {
                state.messagesError = initialMessagesState.messagesError
                state.messagesLoading = initialMessagesState.messagesLoading

                const updatedMessages = action.payload as MessageSchema[]
                for (const message of updatedMessages) {
                    state.messagesById[message.id as string] = message
                }
            }
        )

        builder.addCase(
            upsertMessage.rejected,
            (state: MessagesState, action) => {
                const { errorMessage } = action.payload as {
                    errorMessage: string
                }

                state.messagesLoading = initialMessagesState.messagesLoading
                state.messagesError = `Error in upsertMessage
                ${errorMessage}
                Request Id: ${action.meta.requestId}`
            }
        )
    },
})

export const messagesReducer = messagesSlice.reducer
