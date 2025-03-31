import S from 'fluent-json-schema'
import { userSchema } from './user'

export const chatRecordSchema = S.object()
    .prop('object', S.string())
    .prop('error', S.string())
    .prop('id', S.string())
    .prop('userId', S.string())
    .prop('title', S.string().required())
    .prop('description', S.string())

export const chatSchema = S.object()
    .prop('timestamp', S.string())
    .extend(chatRecordSchema)

export const chatInputSchema = S.object()
    .prop('id', S.string())
    .prop('title', S.string().required())
    .prop('description', S.string())

export const chatInputsSchema = S.object().prop(
    'chats',
    S.array().items(chatInputSchema)
)

export const chatsSchema = S.object().prop('chats', S.array().items(chatSchema))
