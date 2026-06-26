import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts.js'
import { authRouter } from './routes/auth.js'
import { editorRouter } from './routes/editor.js'
import { adminRouter } from './routes/admin.js'
import { usersRouter } from './routes/users.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' })
})

app.use('/api/posts', postsRouter)

app.use('/api/auth', authRouter)

app.use('/api/editor', editorRouter)

app.use('/api/admin', adminRouter)

app.use('/api/users', usersRouter)

app.use((error, _request, response, _next) => {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
    response.status(500).json({ message: error.message || 'Internal Server Error' })
})

// 只有在本地開發環境 (非 production) 才啟動常駐監聽
if (process.env.NODE_ENV !== 'production') {
    const port = Number(process.env.PORT || 3000)
    app.listen(port, () => {
        console.log(`API server listening on http://localhost:${port}`)
    })
}

// 匯出 app，供 Vercel 呼叫
export default app