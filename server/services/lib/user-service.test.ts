import { userService } from '../lib/user-service'
import { UsersSchema } from '../../../server/data-model/types/src'

describe('UserService', () => {
    it('should get users', async () => {
        const users = await userService.getUsers()
        expect(users).toBeTruthy()
    })

    it('should create new user', async () => {
        const users = await userService.upsertUsers({
            users: [
                {
                    firstName: 'testFirstName_Joe',
                    lastName: 'testLastName_Doe',
                    email: 'testEmail_johnDoe',
                },
            ],
        })
        expect(users).toBeTruthy()
    })

    it('should get users by emails or ids', async () => {
        const emails = ['testEmail_johnDoe']
        const userIds: string[] = []
        const response = (await userService.getUsersByEmailsOrByIds(
            emails,
            userIds
        )) as UsersSchema

        expect(response.users).toBeTruthy()
        expect(response.users.length).toBe(1)
        expect(response.users[0].email).toBe('testEmail_johnDoe')
    })

    it('should update user', async () => {
        const response = await userService.upsertUsers({
            users: [
                {
                    firstName: 'updated_testFirstName_Joe',
                    lastName: 'updated_testLastName_Doe',
                    email: 'testEmail_johnDoe',
                },
            ],
        })

        expect(response.users).toBeTruthy()
        expect(response.users.length).toBe(1)
        expect(response.users[0].firstName).toBe('updated_testFirstName_Joe')
    })

    it('should delete users', async () => {
        const emails = ['testEmail_johnDoe']
        const userIds: string[] = []

        const response = (await userService.deleteUsersByUserIdsOrEmails(
            userIds,
            emails
        )) as UsersSchema

        expect(response.users).toBeTruthy()
        expect(response.users.length).toBe(1)
        expect(response.users[0].email).toBe('testEmail_johnDoe')
    })
})
