import type { Post } from '../types/post'

const posts: Post[] = []

export const getPosts = async () => {
  return posts
}

export const getPostById = async (id: string) => {
  return posts.find((post) => post.id === id) ?? null
}
