export type EditorApplication = {
    id: string
    user_id: string
    remark: string | null
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
}