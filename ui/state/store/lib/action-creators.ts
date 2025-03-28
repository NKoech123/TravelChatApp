import { getChats, upsertChat, deleteChats } from './slices/chats.slice'
import { getMessages, upsertMessage } from './slices/messages.slice'
/** 
  Combines all the action creators in a centralized location
**/
export const actionCreators = {
    // Chats
    getChats,
    upsertChat,
    deleteChats,

    // Messages
    getMessages,
    upsertMessage,
}
