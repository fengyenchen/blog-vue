export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  user_id: string
  title: string
  content: string
  excerpt: string | null
  cover_image: string | null
  status: PostStatus
  created_at: string
  updated_at: string
  is_pinned: boolean
  is_disabled: boolean
}
