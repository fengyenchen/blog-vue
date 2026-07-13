export interface User {
    id: string
    username: string
    role: 'admin' | 'editor' | 'user'
    created_at: string
    updated_at: string
}

export interface LoginSuccessResponse {
    success: true
    token: string
    user: User
}

export interface LoginErrorResponse {
    success: false
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse
