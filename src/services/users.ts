import type { User } from '../types/auth'

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