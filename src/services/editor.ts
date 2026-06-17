import type { Post } from '../types/post.ts'

export const editorFetchPosts = async (userId: string) => {
    if (!userId) {
        throw new Error('未偵測到使用者 ID，請重新登入。')
    }

    const response = await fetch(`/api/editor/user/${userId}`)

    if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`)
    }

    return (await response.json()) as Post[]
}

export const getEditorPostById = async (id: string) => {
    const response = await fetch(`/api/editor/edit/${id}`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to load post: ${response.status}`)
    }

    return (await response.json()) as Post
}

// 自動產生摘要的輔助函數
const generateExcerpt = (content: string): string => {
    const plainText = content.replace(/[#*`\n]/g, ' ').trim()
    return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText
}

// 新增文章
export const createArticle = async (
    userId: string,
    title: string, 
    content: string, 
    status: 'draft' | 'published', 
    coverImage: string | null,
    excerpt: string | null 
) => {
    // 如果使用者有自己填寫摘要，就用填寫的；沒有的話才由系統自動生成
    const finalExcerpt = excerpt?.trim() ? excerpt.trim() : generateExcerpt(content)

    if (!userId) {
        throw new Error('未偵測到使用者 ID，請重新登入。')
    }

    const response = await fetch('/api/editor/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: userId,
            title, 
            content, 
            status, 
            cover_image: coverImage, 
            excerpt: finalExcerpt || null
        })
    })

    if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`)
    }
    return (await response.json()) as Post
}

// 更新文章
export const updateArticle = async (
    userId: string,
    role: string,
    id: string, 
    title: string, 
    content: string, 
    status: 'draft' | 'published', 
    coverImage: string | null,
    excerpt: string | null
) => {
    const finalExcerpt = excerpt?.trim() ? excerpt.trim() : generateExcerpt(content)

    if (!userId) {
        throw new Error('未偵測到使用者 ID，請重新登入。')
    }

    const response = await fetch(`/api/editor/edit/${id}?role=${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: userId,
            title, 
            content, 
            status, 
            cover_image: coverImage, 
            excerpt: finalExcerpt || null
        })
    })

    if (!response.ok) {
        throw new Error(`Failed to update post: ${response.status}`)
    }
    return (await response.json()) as Post
}

// 刪除文章
export const deleteArticle = async (id: string, userId: string, role: string) => {
    if (!userId) {
        throw new Error('未偵測到使用者 ID，無法執行刪除。')
    }

    const response = await fetch(`/api/editor/edit/${id}?userId=${userId}&role=${role}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`)
    }
    return true
}