export interface User {
    id: string
    username: string
    role: 'admin' | 'editor' | 'user'
}

export interface LoginSuccessResponse {
    success: true
    user: User
}

export interface LoginErrorResponse {
    success: false
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse