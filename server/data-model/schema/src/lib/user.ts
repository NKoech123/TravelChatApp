import S from 'fluent-json-schema'

export const userRecordSchema = S.object()
    .prop('object', S.string())
    .prop('error', S.string())
    .prop('id', S.string())
    .prop('firstName', S.string())
    .prop('lastName', S.string())
    .prop('userName', S.string())
    .prop('email', S.string())

export const userSchema = S.object().extend(userRecordSchema)

export const userContextSchema = S.object().extend(userSchema)

export const usersSchema = S.object().prop(
    'users',
    S.array().items(userSchema).required()
)
