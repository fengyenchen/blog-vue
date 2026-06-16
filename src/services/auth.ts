import type { LoginSuccessResponse } from '../types/auth'

export const loginService = async (role: 'admin' | 'editor' | 'user', username: string, password: string) => {
    const response = await fetch('/api/auth', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, username, password }),
    })

    if (!response.ok) {
        throw new Error('帳號或密碼錯誤')
    }

    return (await response.json()) as LoginSuccessResponse
}

export const applyForEditorService = async (username: string, password: string, remark: string) => {
    const response = await fetch('/api/auth/apply-for-editor', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, remark }),
    })

    if (!response.ok) {
        throw new Error('申請失敗')
    }

    return (await response.json()) as LoginSuccessResponse
}
