import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? 'FakeKey',
    timeout: 300 * 1000,
    dangerouslyAllowBrowser: true,
})

export default openai
