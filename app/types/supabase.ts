export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          content: string
          image: string | null
          pub_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          content: string
          image?: string | null
          pub_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          content?: string
          image?: string | null
          pub_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
    }
  }
}
