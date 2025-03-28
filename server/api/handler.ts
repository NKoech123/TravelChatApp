import app from './app'

app.listen({ port: 3001 }, err => {
    if (err) console.error(err)
    console.log('api started on Port 3001')
})

export const handler = null
