import type { LoginSuccessResponse } from '../types/auth'
import { apiFetch, publicFetch } from './api'

type UserRole = 'admin' | 'editor' | 'user'

interface JwtClaims {
    sub: string
    role: UserRole
    exp?: number
}

export const logout = () => {
    localStorage.removeItem('token')
}

export const getAuthRole = (): UserRole | null => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const payload = token.split('.')[1]
        const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtClaims
        if (!claims.sub || !claims.role || (claims.exp && claims.exp * 1000 <= Date.now())) {
            logout()
            return null
        }
        return claims.role
    } catch {
        logout()
        return null
    }
}

export const loginService = async (role: 'admin' | 'editor' | 'user', username: string, password: string) => {
    const response = await publicFetch('/auth', {
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
    const response = await publicFetch('/auth/apply-for-editor', {
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

export const changePasswordService = async (password: string, newPassword: string) => {
    const response = await apiFetch('/auth/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, newPassword }),
    })

    if (!response.ok) {
        throw new Error('帳號或密碼錯誤')
    }

    return (await response.json()) as LoginSuccessResponse
}
