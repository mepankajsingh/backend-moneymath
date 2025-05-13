export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  author?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at: string;
  tags?: string | null;
  is_published: boolean;
  is_featured: boolean;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPostTag {
  id: number;
  post_id: number;
  tag_id: number;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id'>;
        Update: Partial<Omit<BlogPost, 'id'>>;
      };
      blog_tags: {
        Row: BlogTag;
        Insert: Omit<BlogTag, 'id'>;
        Update: Partial<Omit<BlogTag, 'id'>>;
      };
      blog_post_tags: {
        Row: BlogPostTag;
        Insert: Omit<BlogPostTag, 'id'>;
        Update: Partial<Omit<BlogPostTag, 'id'>>;
      };
    };
  };
};
