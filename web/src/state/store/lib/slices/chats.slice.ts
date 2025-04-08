import { ChatSchema, ChatsSchema, OutputChipsSchema } from '@nicholas/types'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import { fetchWrapper, apiDomain } from '../../../../client-utils'
import { ActionSheetIOS } from 'react-native'

interface ChatsState {
    chatsLoading: boolean
    chatsError: string
    chatsById: { [key: string]: ChatSchema }
    activeChatId: string | null
    chipsByChatId: { [key: string]: string[] }
    chipsLoading: boolean
    chipsError: string
}

const initialChatsState: ChatsState = {
    chatsLoading: false,
    chatsError: '',
    chatsById: {},
    activeChatId: null,
    chipsByChatId: {},
    chipsLoading: false,
    chipsError: '',
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

export const getChips = createAsyncThunk(
    'chats/getChips',
    async (data: { chatId: string, existingChips?: string[] }, { rejectWithValue }) => {
        const { chatId, existingChips } = data
        const respJson = (await fetchWrapper({
            method: 'POST',
            url: `${apiDomain}/api/llm-encrich-chips`,
            requiresAccessToken: false,
            body: { chatId, existingChips },
        })) as OutputChipsSchema

        return { chatId, chips: respJson.chips as string[] }
    }
)

export const upsertChat = createAsyncThunk(
    'chats/upsertChat',
    async (
        data: { chats: ChatsSchema; handleSuccess: (id: string) => void },
        { rejectWithValue }
    ) => {
        const { chats, handleSuccess } = data

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


            handleSuccess(respJson.chats?.[0]?.id as string)
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
    reducers: {
        setActiveChatId: (state: ChatsState, action: PayloadAction<string>) => {
            state.activeChatId = action.payload
        },
    },
    extraReducers: builder => {
        builder.addCase(getChips.pending, (state: ChatsState, action) => {
            state.chipsLoading = true
            state.chipsError = ''
        })

        builder.addCase(getChips.fulfilled, (state: ChatsState, action: PayloadAction<{ chatId: string; chips: string[] }>) => {
            state.chipsLoading = false
            state.chipsError = ''

            state.chipsByChatId[action.payload.chatId] = action.payload.chips
        })

        builder.addCase(getChips.rejected, (state: ChatsState, action) => {
            state.chipsLoading = false
            state.chipsError = action.error.message as string
        })

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
export const { setActiveChatId } = chatsSlice.actions
