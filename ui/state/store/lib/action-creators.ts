import { getChats, upsertChat, deleteChats } from './slices/chats.slice'
/** 
  Combines all the action creators in a centralized location
**/
export const actionCreators = {
    // Chats
    getChats,
    upsertChat,
    deleteChats,
}
