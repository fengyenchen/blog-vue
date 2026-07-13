import { Router } from 'express'
import { pool } from '../db/pool.js'
import { authenticate, requireRole } from '../middleware/auth.js'

export const usersRouter = Router()

usersRouter.get('/', authenticate, requireRole('admin'), async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT DISTINCT ON (username) id, username, role, created_at, updated_at
             FROM public.users
             ORDER BY username, created_at DESC`,
        )

        if (rows.length === 0) {
            response.status(404).json({ message: 'Users not found' })
            return
        }

        // 依照角色和 ID 進行排序，並且同一角色內按照 ID 降序排列
        const sortedRows = rows.sort((a, b) => {
            // 優先依據角色排序 (例如 admin -> editor -> user)
            if (a.role !== b.role) {
                return a.role.localeCompare(b.role);
            }
            // 角色相同時，依據 id 降冪排序
            return b.id.localeCompare(a.id);
        });

        response.json(sortedRows)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/:id', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, username, role, created_at, updated_at
       FROM public.users
       WHERE id = $1
       LIMIT 1`,
            [request.params.id],
        )

        if (rows.length === 0) {
            response.status(404).json({ message: 'User not found' })
            return
        }

        response.json(rows[0])
    } catch (error) {
        next(error)
    }
})