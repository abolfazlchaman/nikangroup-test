export interface BlogPost {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  createdAt?: string;
}

export interface PaginatedResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
} 