import { Router } from 'express'
import { pool } from '../db/pool.js'

export const adminRouter = Router()

adminRouter.get('/editor-applications', async (_request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, user_id, remark, status, created_at, updated_at
       FROM public.editor_applications
       ORDER BY created_at DESC, id DESC`,
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

adminRouter.get('/editor-applications/pending', async (_request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, user_id, remark, status, created_at, updated_at
       FROM public.editor_applications
       WHERE status = 'pending'
       ORDER BY created_at DESC, id DESC`,
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

adminRouter.put('/editor-applications/:id/:status', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `UPDATE public.editor_applications
           SET status = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING *`,
            [request.params.status, request.params.id]
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

adminRouter.post('/users/:userId/:role', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `UPDATE public.users
             SET role = $1
             WHERE id = $2
             RETURNING *`,
            [request.params.role, request.params.userId]
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})