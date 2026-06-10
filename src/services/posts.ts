import type { Post } from '../types/post'
import { ref } from 'vue'

const posts: Post[] = [
  {
    id: '1',
    title: 'Welcome to My Blog',
    content: '<p>This is the first post on the blog. Hello world!</p>',
    excerpt: 'This is the first post on the blog.',
    cover_image: '/assets/covers/welcome.jpg',
    status: 'published',
    created_at: '2026-06-01T08:00:00Z',
    updated_at: '2026-06-01T08:00:00Z',
  },
  {
    id: '2',
    title: 'Draft: About Upcoming Features',
    content:
      '<p>We are working on several new features including a new editor and improved search.</p>',
    excerpt: 'We are working on several new features.',
    cover_image: null,
    status: 'draft',
    created_at: '2026-06-05T12:30:00Z',
    updated_at: '2026-06-06T09:15:00Z',
  },
  {
    id: '3',
    title: 'How I Organize My Writing',
    content:
      '<p>In this post I share tips on how I plan, draft, and publish articles efficiently.</p>',
    excerpt: 'Tips on planning, drafting, and publishing articles.',
    cover_image: '/assets/covers/organize.jpg',
    status: 'published',
    created_at: '2026-05-20T16:45:00Z',
    updated_at: '2026-05-22T10:00:00Z',
  },
]

export const visiblePostIds = ref<string[]>(posts.map((post) => post.id))

export const getPosts = async () => {
  return posts
}

export const getPostById = async (id: string) => {
  return posts.find((post) => post.id === id) ?? null
}

export const getPostByTitle = async (title: string) => {
  const q = title.trim().toLowerCase()
  if (!q) return posts.map((post) => post.id)
  return posts
    .filter((post) => post.title.toLowerCase().includes(q))
    .map((post) => post.id)
}