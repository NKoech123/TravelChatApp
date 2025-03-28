import { combineReducers } from 'redux'

import { chatsReducer } from './slices/chats.slice'
import { messagesReducer } from './slices/messages.slice'

/** 
  Combines all the reducers in a centralized location
**/
export const reducers = combineReducers({
    // Chats
    chats: chatsReducer,

    // Messages
    messages: messagesReducer,
})
