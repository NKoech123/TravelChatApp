import { FastifyInstance } from 'fastify'

import user from './routes/user'
import chat from './routes/chat'
import llm from './routes/llm'

export default async function loadAllRoutes(app: FastifyInstance) {
    chat(app)
    user(app)
    llm(app)
}
