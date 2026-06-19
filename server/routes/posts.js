import { Router } from 'express'
import { pool } from '../db/pool.js'

export const postsRouter = Router()

postsRouter.get('/', async (_request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT *
       FROM public.posts
       WHERE status = 'published'
       ORDER BY created_at DESC, id DESC`,
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

postsRouter.get('/post/:id', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT *
       FROM public.posts
       WHERE id = $1 AND status = 'published'
       LIMIT 1`,
            [request.params.id],
        )

        if (rows.length === 0) {
            response.status(404).json({ message: 'Post not found' })
            return
        }

        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})
