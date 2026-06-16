import type { User } from '../types/auth'

export const getAllUsers = async () => {
    const response = await fetch(`/api/users`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to find user: ${response.status}`)
    }

    return await response.json()
}

export const getUsersByUsername = async (username: string) => {
    const q = username.trim().toLowerCase()
    const users = await getAllUsers() as User[]

    if (!q) {
        return users
    }

    return users.filter((user) => user.username.toLowerCase().includes(q))
}


export const getUsernameByUserId = async (id: string) => {
    const response = await fetch(`/api/users/${id}`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to find user: ${response.status}`)
    }

    const user = (await response.json()) as User
    return user.username
}