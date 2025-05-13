export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string | null;
  pub_date: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}
