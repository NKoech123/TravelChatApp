import { ChatSchema, ChatsSchema } from '@nicholas/types'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { fetchWrapper, apiDomain } from '../../../../client-utils'

interface ChatsState {
    chatsLoading: boolean
    chatsError: string
    chatsById: { [key: string]: ChatSchema }
}

const initialChatsState: ChatsState = {
    chatsLoading: false,
    chatsError: '',
    chatsById: {},
}

export const getChats = createAsyncThunk('chats/getChats', async () => {
    const respJson = await fetchWrapper({
        method: 'GET',
        url: `${apiDomain}/api/chats`,
        requiresAccessToken: true,
    })

    for (const chat of respJson.chats) {
        if (chat.error) {
            throw new Error(chat.error)
        }
    }
    return respJson.chats as ChatSchema[]
})

export const upsertChat = createAsyncThunk(
    'chats/upsertChat',
    async (
        data: { chats: ChatsSchema; handleSuccess: () => void },
        { rejectWithValue }
    ) => {
        const { chats, handleSuccess } = data
        console.log('chats', chats)
        try {
            const respJson = (await fetchWrapper({
                method: 'POST',
                url: `${apiDomain}/api/chats`,
                requiresAccessToken: false,
                body: { chats: chats.chats },
            })) as ChatsSchema

            for (const chat of respJson.chats ?? []) {
                if (chat.error) {
                    throw new Error(chat.error)
                }
            }
            console.log('respJson chats', respJson.chats)

            handleSuccess()
            return respJson.chats as ChatSchema[]
        } catch (error) {
            return rejectWithValue({
                errorMessage: `${error}`,
            })
        }
    }
)

export const chatsSlice = createSlice({
    name: 'chats',
    initialState: initialChatsState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getChats.pending, (state: ChatsState) => {
            state.chatsLoading = true
            state.chatsError = initialChatsState.chatsError
        })

        builder.addCase(
            getChats.fulfilled,
            (state: ChatsState, action: PayloadAction<ChatSchema[]>) => {
                state.chatsLoading = initialChatsState.chatsLoading
                state.chatsError = ''

                const allChats = action.payload as ChatSchema[]
                for (const chat of allChats) {
                    state.chatsById[chat.id as string] = chat
                }
            }
        )

        builder.addCase(getChats.rejected, (state, action) => {
            state.chatsError = action.error.message as string
        })

        builder.addCase(upsertChat.pending, (state: ChatsState, action) => {
            state.chatsError = initialChatsState.chatsError
            state.chatsLoading = true
        })

        builder.addCase(upsertChat.fulfilled, (state: ChatsState, action) => {
            state.chatsError = initialChatsState.chatsError
            state.chatsLoading = initialChatsState.chatsLoading

            const updatedChats = action.payload as ChatSchema[]
            for (const chat of updatedChats) {
                state.chatsById[chat.id as string] = chat
            }
        })

        builder.addCase(upsertChat.rejected, (state: ChatsState, action) => {
            const { errorMessage } = action.payload as {
                errorMessage: string
            }

            state.chatsLoading = initialChatsState.chatsLoading
            state.chatsError = `Error in upsertChat
                ${errorMessage}
                Request Id: ${action.meta.requestId}`
        })
    },
})

export const chatsReducer = chatsSlice.reducer
