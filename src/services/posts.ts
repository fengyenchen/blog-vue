import type { Post } from '../types/post'
import type { User } from '../types/auth'
import { ref } from 'vue'

export const visiblePostIds = ref<string[]>([])

export const fetchPosts = async () => {
    const response = await fetch('/api/posts')

    if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`)
    }

    return (await response.json()) as Post[]
}

export const getPostById = async (id: string) => {
    const response = await fetch(`/api/posts/${id}`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to load post: ${response.status}`)
    }

    return (await response.json()) as Post
}

export const getPostByTitle = async (title: string) => {
    const q = title.trim().toLowerCase()
    const posts = await fetchPosts()

    if (!q) {
        return posts.map((post) => post.id)
    }

    return posts.filter((post) => post.title.toLowerCase().includes(q)).map((post) => post.id)
}

export const getUsernameByUserId = async (id: string) => {
    const response = await fetch(`/api/users/${id}`)
    
    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error(`Failed to find user: ${response.status}`)
    }

    return (await response.json()) as User
}