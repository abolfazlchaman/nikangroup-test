import { NextResponse } from 'next/server';
import type { BlogPost, PaginatedResponse } from '@/app/types/blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    // Filter posts based on search query
    const filteredPosts = posts.filter((post: { title: string; body: string }) => 
      post.title.toLowerCase().includes(query) || 
      post.body.toLowerCase().includes(query)
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    const postsWithImages: BlogPost[] = paginatedPosts.map((post: { id: number; title: string; body: string }) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      imageUrl: `https://picsum.photos/seed/${post.id}/500/300`,
    }));

    const responseData: PaginatedResponse = {
      posts: postsWithImages,
      total: filteredPosts.length,
      page,
      limit,
    };

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to search posts';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 