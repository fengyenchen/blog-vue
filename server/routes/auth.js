import { Router } from 'express'
import { pool } from '../db/pool.js'

export const authRouter = Router()

authRouter.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body

        const { rows } = await pool.query(
            `SELECT id, username, password_hash, role 
       FROM public.users 
       WHERE username = $1 
       LIMIT 1`,
            [username],
        )

        if (rows.length === 0) {
            response.status(401).json({ success: false })
            return
        }

        const user = rows[0]

        if (user.password_hash === password) {
            response.json({
                success: true,
                user: {
                    role: user.role,
                    id: user.id,
                    username: user.username,
                },
            })
        } else {
            response.status(401).json({ success: false })
        }
    } catch (error) {
        next(error)
    }
})

authRouter.post('/apply-for-editor', async (request, response, next) => {
    try {
        const { username, password, remark } = request.body

        const userCheck = await pool.query(
            'SELECT id FROM public.users WHERE username = $1',
            [username]
        )

        if (userCheck.rows.length > 0) {
            return response.status(400).json({
                success: false,
                message: '該使用者名稱已被註冊'
            })
        }

        const userResult = await pool.query(
            `INSERT INTO public.users (username, password_hash, role) 
             VALUES ($1, $2, 'user') 
             RETURNING id, username, role`,
            [username, password]
        )

        const newUser = userResult.rows[0]

        const appResult = await pool.query(
            `INSERT INTO public.editor_applications (user_id, remark) 
             VALUES ($1, $2) 
             RETURNING id, user_id, remark`,
            [newUser.id, remark || '']
        )

        response.json({
            success: true,
            user: {
                role: newUser.role,
                id: newUser.id,
                username: newUser.username
            }
        })
    } catch (error) {
        next(error)
    }
})