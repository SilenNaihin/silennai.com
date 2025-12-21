export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  publishedDate?: string;
  tags?: string[];
}

export interface BlogData {
  posts: BlogPost[];
  lastUpdated: string;
}

