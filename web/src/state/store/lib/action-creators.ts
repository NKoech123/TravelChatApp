import { getChats, upsertChat, setActiveChatId } from './slices/chats.slice'
import { getMessages, upsertMessage } from './slices/messages.slice'
/** 
  Combines all the action creators in a centralized location
**/
export const actionCreators = {
    // Chats
    getChats,
    upsertChat,
    setActiveChatId,

    // Messages
    getMessages,
    upsertMessage,
}
