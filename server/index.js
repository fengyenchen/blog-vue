import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts.js'

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
})

app.use('/api/posts', postsRouter)

app.use((error, _request, response, _next) => {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    response.status(500).json({ message: error.message || 'Internal Server Error' })
})

app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`)
})
