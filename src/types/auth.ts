export interface User {
    role: 'admin' | 'editor' | 'user'
    id: string
    username: string
}

export interface LoginSuccessResponse {
    success: true
    user: User
}

export interface LoginErrorResponse {
    success: false
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse