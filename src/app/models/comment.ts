export interface Comment {
  comment_id: string
  username: string
  page_id: number
  content: string
  rating: number
  created_at: string
  updated_at: string
}

export interface ModifyComment {
  username: string
  content: string
  rating: number
}
