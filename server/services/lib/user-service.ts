import { UsersSchema, UserSchema } from '../../../server/data-model/types/src'
import prisma from './clients/prisma-client'
import { Prisma } from '@prisma/client'
import { prismaErrorHandler } from './clients/prisma-error-handler'
import { logger } from '../../log-utils'

function retainOnlyValidFields(record: object, fields: Set<string>) {
    const validRecord: {
        id?: string
        createdDate?: string
        updatedDate?: string
    } = { ...record }

    if (!validRecord['id']) {
        delete validRecord['id']
    }

    delete validRecord['createdDate']
    delete validRecord['updatedDate']

    for (const field in validRecord) {
        if (
            validRecord[field as keyof typeof validRecord] === '' &&
            validRecord['id']
        ) {
            validRecord[field as keyof typeof validRecord] = ''
        }

        if (!fields.has(field)) {
            delete validRecord[field as keyof typeof validRecord]
        }
    }

    return validRecord
}

const ALL_USER_FIELDS = new Set(Object.keys(Prisma.UserScalarFieldEnum))

class UserService {
    async getUsers() {
        const users = await prisma.user.findMany()
        return { users }
    }

    public async getUserByEmail(email: string): Promise<UserSchema | null> {
        const userRecord = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (!userRecord) {
            const userToCreate: UserSchema = {
                email: email,
                firstName: 'Nicholas',
                lastName: 'Koech',
                userName: 'NicholasKoech',
            }
            const newUser = await prisma.user.create({
                data: userToCreate as Prisma.UserCreateInput,
            })
            return newUser as UserSchema
        }

        return userRecord as UserSchema
    }

    public async getUser(userId: string): Promise<UserSchema | null> {
        const userRecord = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        return userRecord as UserSchema
    }

    async getUsersByEmailsOrByIds(
        emails?: string[],
        userIds?: string[]
    ): Promise<UsersSchema> {
        const results: UsersSchema = { users: [] }

        const users = (await prisma.user.findMany({
            where: {
                OR: [
                    {
                        id: {
                            in: userIds,
                        },
                    },
                    {
                        email: {
                            in: emails,
                        },
                    },
                ],
            },
        })) as UserSchema[]

        for (const user of users) {
            results.users.push(user)
        }

        return results
    }

    async getExistingUsersMapByEmailsOrByIds(
        users: UsersSchema
    ): Promise<{ [key: string]: UserSchema }> {
        const userIds: string[] = []
        const emails: string[] = []
        for (const user of users.users) {
            if (user.id) {
                userIds.push(user.id)
            } else {
                emails.push(user.email as string)
            }
        }

        const exisitingUsers = await this.getUsersByEmailsOrByIds(
            emails,
            userIds
        )

        const existingUsersByIdOrEmail: { [key: string]: UserSchema } = {}

        for (const user of exisitingUsers.users) {
            existingUsersByIdOrEmail[user.id as string] = user
            existingUsersByIdOrEmail[user.email as string] = user
        }

        return { existingUsersByIdOrEmail }
    }

    async upsertUsers(users: UsersSchema): Promise<UsersSchema> {
        const results: UsersSchema = { users: [] }

        const { existingUsersByIdOrEmail } =
            await this.getExistingUsersMapByEmailsOrByIds(users)

        for (const user of users.users) {
            results.users.push(
                await this.upsertUser(
                    user,
                    existingUsersByIdOrEmail as { [key: string]: UserSchema }
                )
            )
        }

        return results
    }

    async upsertUser(
        user: UserSchema,
        existingUsersByIdOrEmail: { [key: string]: UserSchema }
    ): Promise<UserSchema> {
        const userForInsert = retainOnlyValidFields(
            user,
            ALL_USER_FIELDS
        ) as UserSchema

        let userResult

        try {
            const existingUser =
                existingUsersByIdOrEmail[userForInsert.id as string] ||
                existingUsersByIdOrEmail[userForInsert.email as string]

            if (!existingUser) {
                userResult = await prisma.user.create({
                    data: userForInsert as Prisma.UserCreateInput,
                })
            } else {
                userResult = await prisma.user.update({
                    where: {
                        id: existingUser.id as string,
                    },
                    data: userForInsert as Prisma.UserUpdateInput,
                })
            }
            return userResult as UserSchema
        } catch (e) {
            return { ...userForInsert, error: prismaErrorHandler(e) }
        }
    }

    async deleteUsersByUserIdsOrEmails(userIds?: string[], emails?: string[]) {
        try {
            const usersToDelete = await this.getUsersByEmailsOrByIds(
                emails,
                userIds
            )

            const deleteResult = await prisma.user.deleteMany({
                where: {
                    OR: [
                        {
                            id: {
                                in: userIds || [],
                            },
                        },
                        {
                            email: {
                                in: emails || [],
                            },
                        },
                    ],
                },
            })

            logger.log({ deleteResultCount: deleteResult.count })

            if (usersToDelete.users.length === deleteResult.count) {
                return usersToDelete
            }

            const remainingUsers = await this.getUsersByEmailsOrByIds(
                emails,
                userIds
            )

            return {
                users: usersToDelete.users.filter(
                    user =>
                        !remainingUsers.users.find(
                            remainingUser => remainingUser.id === user.id
                        )
                ),
            }
        } catch (e) {
            logger.error({ 'Error deleting users:': prismaErrorHandler(e) })
            return { error: prismaErrorHandler(e) }
        }
    }
}

export const userService = new UserService()
