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
             SET role = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [request.params.role, request.params.userId]
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

adminRouter.put('/posts/:postId/status', async (request, response, next) => {
    try {
        const { postId } = request.params
        const { is_pinned, is_disabled } = request.body

        // 使用 COALESCE($1, is_pinned)：如果前端沒傳該欄位，就維持資料庫原本的值
        const { rows } = await pool.query(
            `UPDATE public.posts
             SET 
                is_pinned = COALESCE($1, is_pinned),
                is_disabled = COALESCE($2, is_disabled),
                updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [
                is_pinned !== undefined ? is_pinned : null, 
                is_disabled !== undefined ? is_disabled : null, 
                postId
            ]
        )
        
        if (rows.length === 0) {
            return response.status(404).json({ message: '找不到該文章' })
        }
        
        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})