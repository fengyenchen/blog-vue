import type { Post } from '../types/post'
import { ref } from 'vue'

export const visiblePostIds = ref<string[]>([])

const fetchPosts = async () => {
    const response = await fetch('/api/posts')

    if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status}`)
    }

    return (await response.json()) as Post[]
}

export const getPosts = async () => {
    const posts = await fetchPosts()
    return posts
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
