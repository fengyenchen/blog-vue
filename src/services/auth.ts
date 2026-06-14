import type { LoginSuccessResponse } from '../types/auth'

export const loginService = async (username: string, password: string) => {
    const response = await fetch('/api/auth', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
        throw new Error('帳號或密碼錯誤')
    }

    return (await response.json()) as LoginSuccessResponse
}