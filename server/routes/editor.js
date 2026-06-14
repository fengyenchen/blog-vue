import { Router } from 'express'
import { pool } from '../db/pool.js'

export const editorRouter = Router()

editorRouter.get('/', async (_request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, author, title, content, excerpt, cover_image, status, created_at, updated_at
       FROM public.posts
       ORDER BY created_at DESC, id DESC`,
        )

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

editorRouter.get('/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        const { rows } = await pool.query(
            `SELECT id, author, title, content, excerpt, cover_image, status, created_at, updated_at
       FROM public.posts
       WHERE id = $1`,
            [id]
        )

        if (rows.length === 0) {
            return response.status(404).json({ error: '找不到該文章' })
        }

        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})


// ==========================================
// 💡 新增功能：處理「儲存」時的更新文章 (PUT /:id)
// ==========================================
editorRouter.put('/:id', async (request, response, next) => {
    try {
        const { id } = request.params
        // 從前端傳來的 JSON payload 裡解構出這 5 個欄位
        const { title, content, status, cover_image, excerpt } = request.body

        // 執行 SQL UPDATE 語句，並順便更新 updated_at 為當前時間
        const { rows } = await pool.query(
            `UPDATE public.posts 
             SET title = $1, content = $2, status = $3, cover_image = $4, excerpt = $5, updated_at = NOW()
             WHERE id = $6 
             RETURNING *`,
            [title, content, status, cover_image, excerpt, id]
        )

        // 如果資料庫回傳 0 列，代表找不到這個 UUID 的文章
        if (rows.length === 0) {
            return response.status(404).json({ error: '找不到該文章，無法更新' })
        }

        // 把更新成功的文章資料吐回給前端
        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})

// ==========================================
// 💡 新增功能：處理全新的「新增文章」 (POST /)
// ==========================================
editorRouter.post('/', async (request, response, next) => {
    try {
        const { title, content, status, cover_image, excerpt } = request.body
        
        // 💡 這裡寫死一個固定作者，等之後做完登入再改成動態撈 token 的作者
        const author = 'fengyenchen' 

        // 執行 SQL INSERT，放空 id, created_at, updated_at 讓 PostgreSQL 的 DEFAULT 預設值自己去填
        const { rows } = await pool.query(
            `INSERT INTO public.posts (author, title, content, status, cover_image, excerpt)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [author, title, content, status, cover_image, excerpt]
        )

        response.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})