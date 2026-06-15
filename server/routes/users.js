import { Router } from 'express'
import { pool } from '../db/pool.js'

export const usersRouter = Router()

usersRouter.get('/', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, username
       FROM public.users`,
        )

        if (rows.length === 0) {
            response.status(404).json({ message: 'Users not found' })
            return
        }

        response.json(rows)
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/:id', async (request, response, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT id, username
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