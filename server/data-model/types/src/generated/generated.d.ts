/* eslint-disable @typescript-eslint/ban-types */
/* tslint:disable */
/* 
   Auto Generated File 
   Generated using npm run schema:generate-types 
   Please Commit All Changes to the Repository! 
*/
/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface UserContextSchema {
  object?: string;
  error?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface UserRecordSchema {
  object?: string;
  error?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
}

/** User Record  */

export interface UserSchema {
  object?: string;
  error?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
}

/** User Records in an object with key like: { users: UserSchema[] }  */

export interface UsersSchema {
  users: {
    object?: string;
    error?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
  }[];
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface ChatInputSchema {
  id?: string;
  title: string;
  description?: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface ChatInputsSchema {
  chats?: {
    id?: string;
    title: string;
    description?: string;
  }[];
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface ChatRecordSchema {
  object?: string;
  error?: string;
  id?: string;
  userId?: string;
  title: string;
  description?: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface ChatSchema {
  object?: string;
  error?: string;
  id?: string;
  userId?: string;
  title: string;
  description?: string;
  timestamp?: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface ChatsSchema {
  chats?: {
    object?: string;
    error?: string;
    id?: string;
    userId?: string;
    title: string;
    description?: string;
    timestamp?: string;
  }[];
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface MessageInputSchema {
  content: string;
  isAI: boolean;
  chatId: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface MessageInputsSchema {
  messages: {
    content: string;
    isAI: boolean;
    chatId: string;
  }[];
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface MessageRecordSchema {
  object?: string;
  error?: string;
  id?: string;
  content?: string;
  isAI?: boolean;
  chatId?: string;
  userId?: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface MessageSchema {
  object?: string;
  error?: string;
  id?: string;
  content?: string;
  isAI?: boolean;
  chatId?: string;
  userId?: string;
  timestamp: string;
}

/** Add a Description in libs/data-model/schema/generate-descriptions.ts  */

export interface MessagesSchema {
  messages: {
    object?: string;
    error?: string;
    id?: string;
    content?: string;
    isAI?: boolean;
    chatId?: string;
    userId?: string;
    timestamp: string;
  }[];
}
