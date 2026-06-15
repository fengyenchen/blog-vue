import { Router } from 'express'
import { pool } from '../db/pool.js'

export const adminRouter = Router()

adminRouter.get('/', async (_request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, user_id, title, content, excerpt, cover_image, status, created_at, updated_at
       FROM public.posts
       ORDER BY created_at DESC, id DESC`,
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})