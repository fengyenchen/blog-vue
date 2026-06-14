import { Router } from 'express'
import { pool } from '../db/pool.js'

export const authRouter = Router()

authRouter.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body

        const { rows } = await pool.query(
            `SELECT id, username, password_hash 
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