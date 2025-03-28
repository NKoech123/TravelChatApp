import { combineReducers } from 'redux'

import { chatsReducer } from './slices/chats.slice'

/** 
  Combines all the reducers in a centralized location
**/
export const reducers = combineReducers({
    // Chats
    chats: chatsReducer,
})
