import { Router } from 'express'
import { pool } from '../db/pool.js'
import { authenticate, requireRole } from '../middleware/auth.js'

export const editorRouter = Router()
editorRouter.use(authenticate, requireRole('editor', 'admin'))

editorRouter.get('/posts', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, user_id, title, content, excerpt, cover_image, status, created_at, updated_at
       FROM public.posts
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
            [request.auth.userId]
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

editorRouter.get('/edit/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const { rows } = await pool.query(
            `SELECT id, user_id, title, content, excerpt, cover_image, status, created_at, updated_at
       FROM public.posts
       WHERE id = $1`,
            [id]
        )

        if (rows.length === 0) {
            return response.status(404).json({ error: '找不到該文章' })
        }

        const post = rows[0]
        if (request.auth.role !== 'admin' && post.user_id !== request.auth.userId) {
            return response.status(403).json({ error: '無權讀取此文章' })
        }

        response.json(post)
    } catch (error) {
        next(error)
    }
})

// 儲存更新的文章
editorRouter.put('/edit/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const { title, content, status, cover_image, excerpt } = request.body

        let result;
        if (request.auth.role === 'admin') {
            result = await pool.query(
                `UPDATE public.posts 
                 SET title = $1, content = $2, status = $3, cover_image = $4, excerpt = $5, updated_at = NOW()
                 WHERE id = $6
                 RETURNING *`,
                [title, content, status, cover_image, excerpt, id]
            )
        } else {
            result = await pool.query(
                `UPDATE public.posts 
                 SET title = $1, content = $2, status = $3, cover_image = $4, excerpt = $5, updated_at = NOW()
                 WHERE id = $6 AND user_id = $7
                 RETURNING *`,
                [title, content, status, cover_image, excerpt, id, request.auth.userId]
            )
        }

        const { rows } = result

        if (rows.length === 0) {
            return response.status(404).json({ error: '找不到該文章，無法更新' })
        }

        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// 儲存新增的文章
editorRouter.post('/edit', async (request, response, next) => {
    try {
        const { title, content, status, cover_image, excerpt } = request.body

        const { rows } = await pool.query(
            `INSERT INTO public.posts (user_id, title, content, status, cover_image, excerpt)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [request.auth.userId, title, content, status, cover_image, excerpt]
        )

        response.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

// 刪除文章
editorRouter.delete('/edit/:id', async (request, response, next) => {
    try {
        const { id } = request.params

        let result
        if (request.auth.role === 'admin') {
            result = await pool.query(
                `DELETE FROM public.posts 
                WHERE id = $1 
                RETURNING id`,
                [id]
            )
        } else {
            result = await pool.query(
                `DELETE FROM public.posts 
                WHERE id = $1 AND user_id = $2 
                RETURNING id`,
                [id, request.auth.userId]
            )
        }
        const { rows } = result
        
        if (rows.length === 0) {
            return response.status(404).json({ error: '找不到該文章，無法刪除' })
        }
        
        response.json({ message: '文章已成功刪除', deletedId: rows[0].id })
    } catch (error) {
        next(error)
    }
})