import S from 'fluent-json-schema'

export const messageRecordSchema = S.object()
    .prop('object', S.string())
    .prop('error', S.string())
    .prop('id', S.string())
    .prop('content', S.string())
    .prop('isAI', S.boolean())
    .prop('chatId', S.string())
    .prop('userId', S.string());


export const messageSchema = S.object()
    .prop('timestamp', S.string().required())
    .extend(messageRecordSchema)

export const messageInputSchema = S.object()
    .prop('content', S.string().required())
    .prop('isAI', S.boolean().required())
    .prop('chatId', S.string().required());

export const messageInputsSchema = S.object().prop(
    'messages',
    S.array().items(messageInputSchema).required()
);

export const messagesSchema = S.object().prop(
    'messages',
    S.array().items(messageSchema).required()
)
