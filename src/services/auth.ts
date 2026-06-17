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
        throw new Error('該使用者名稱已被註冊，請換一個！')
    }

    return (await response.json()) as LoginSuccessResponse
}

export const changePasswordService = async (role: 'admin' | 'editor' | 'user', username: string, password: string, newPassword: string) => {
    const response = await fetch('/api/auth/change-password', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, username, password, newPassword }),
    })

    if (!response.ok) {
        throw new Error('帳號或密碼錯誤')
    }

    return (await response.json()) as LoginSuccessResponse
}