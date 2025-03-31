import app from './app'

app.listen(
    {
        port: 3001,
        host: '0.0.0.0',
        
    },
    err => {
        if (err) console.error(err)
        console.log('API started on http://localhost:3001')
        console.log('For mobile devices, use your local IP address')
    }
)

export const handler = null
