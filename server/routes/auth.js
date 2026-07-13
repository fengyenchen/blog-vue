import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool.js'
import { authenticate, requireRole } from '../middleware/auth.js'

export const authRouter = Router()
const saltRounds = 10; // 雜湊的加鹽複雜度

const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set')
    }

    return jwt.sign(
        { role: user.role },
        process.env.JWT_SECRET,
        { subject: user.id, expiresIn: '24h' },
    )
}

authRouter.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body

        const { rows } = await pool.query(
            `SELECT id, username, password_hash, role, created_at, updated_at 
       FROM public.users 
       WHERE username = $1 AND (role = 'admin' OR role = 'editor')
       LIMIT 1`,
            [username],
        )

        if (rows.length === 0) {
            response.status(401).json({ success: false })
            return
        }

        const user = rows[0]

        // 使用 bcrypt 比對密碼
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash)
        if (isPasswordMatch) {
            response.json({
                success: true,
                token: createToken(user),
                user: {
                    role: user.role,
                    id: user.id,
                    username: user.username,
                    created_at: user.created_at,
                    updated_at: user.updated_at
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

        // 將密碼進行雜湊處理
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const tempUser = await pool.query(
            `INSERT INTO public.users (username, password_hash, role) 
             VALUES ($1, $2, 'user') 
             RETURNING id, username, role`,
            [username, hashedPassword]
        )
        
        const newUser = tempUser.rows[0]

        const userCheck = await pool.query(
            `SELECT u.id
             FROM public.users u
             LEFT JOIN public.editor_applications e ON u.id = e.user_id
             WHERE (u.username = $1 OR u.username = 'admin') AND (u.role = 'editor' OR e.status = 'pending') AND u.id != $2
             LIMIT 1`,
            [newUser.username, newUser.id]
        )

        if (userCheck.rows.length > 0) {
            await pool.query(
                `DELETE FROM public.users
                 WHERE id = $1`,
                [newUser.id]
            )

            return response.status(400).json({
                success: false,
                message: '該使用者名稱已被註冊'
            })
        }

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

authRouter.post('/change-password', authenticate, requireRole('admin', 'editor'), async (request, response, next) => {
    try {
        const { password, newPassword } = request.body

        const { rows } = await pool.query(
            `SELECT id, username, password_hash, role, created_at, updated_at 
       FROM public.users 
       WHERE id = $1 AND (role = 'admin' OR role = 'editor')
       LIMIT 1`,
            [request.auth.userId],
        )

        if (rows.length === 0) {
            response.status(401).json({ success: false })
            return
        }

        const user = rows[0]

        // 使用 bcrypt 比對密碼
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash)

        // 將「新密碼」重新雜湊加鹽
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

        if (isPasswordMatch) {
            const { rows: updatedRows } = await pool.query(
                `UPDATE public.users
            SET password_hash = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, username, role, created_at, updated_at`,
                    [hashedNewPassword, user.id],
                )

            const updatedUser = updatedRows[0]

            response.json({
                success: true,
                user: {
                    role: updatedUser.role,
                    id: updatedUser.id,
                    username: updatedUser.username,
                    created_at: updatedUser.created_at,
                    updated_at: updatedUser.updated_at,
                },
            })
        } else {
            response.status(401).json({ success: false })
        }
    } catch (error) {
        next(error)
    }
})