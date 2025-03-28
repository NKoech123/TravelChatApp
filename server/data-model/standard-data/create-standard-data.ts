import { users } from './data'
import { chatService, userService } from '@nicholas/services'
import { logger } from '@nicholas/log-utils'

const chats = [
    {
        title: 'Restaurants in Rome',
        description: 'I am looking for a good restaurant in Rome',
    },
    {
        title: 'Family Itinerary in Shanghai',
        description: 'I am looking for a good restaurant in Shanghai',
    },
    {
        title: 'Shopping in Paris',
        description: 'I am looking for a good restaurant in Paris',
    },
    {
        title: 'Travel Ideation',
        description: 'I am looking for a good restaurant in Paris',
    },
]

export class CreateStandardData {
    async createStandardData() {
        const user = await userService.upsertUsers({ users })
        logger.log(`Created ${user.users.length} users`)

        const userId = user.users[0].id

        const chatsWithIds = chats.map(chat => ({
            ...chat,
            userId,
        }))

        const chat = await chatService.upsertChats({ chats: chatsWithIds })
        logger.log(`Created ${chat?.chats?.length ?? 0} chats`)
    }
}

export const createStandardData = new CreateStandardData()
