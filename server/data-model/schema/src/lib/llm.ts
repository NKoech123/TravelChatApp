import S from 'fluent-json-schema'

export const inputChipsSchema = S.object()
    .prop('chatId', S.string())
    .prop('existingChips', S.array().items(S.string()))

export const outputChipsSchema = S.object()
    .prop('chatId', S.string())
    .prop('chips', S.array().items(S.string()))

