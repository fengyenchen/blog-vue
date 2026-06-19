import type { EditorApplication } from '../types/editorApplication.ts'
import { ref } from 'vue'

export const visibleUsersId = ref<string[]>([])

export const getEditorApplications = async () => {
    const response = await fetch('/api/admin/editor-applications/pending')

    if (!response.ok) {
        throw new Error(`Failed to load editor applications: ${response.status}`)
    }

    return (await response.json()) as EditorApplication[]
}

export const editorUpdateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`/api/admin/editor-applications/${id}/${status}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })

    if (!response.ok) {
        throw new Error(`Failed to update application status: ${response.status}`)
    }

    return await response.json()
}

export const changeUserRole = async (userId: string, role: string) => {
    const response = await fetch(`/api/admin/users/${userId}/${role}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
    })

    if (!response.ok) {
        throw new Error(`Failed to update user role: ${response.status}`)
    }

    return await response.json()
}

export const updatePostStatus = async (postId: string, status: { is_pinned?: boolean; is_disabled?: boolean }) => {
    const response = await fetch(`/api/admin/posts/${postId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
    })

    if (!response.ok) {
        throw new Error(`Failed to update post status: ${response.status}`)
    }
    
    return await response.json()
}