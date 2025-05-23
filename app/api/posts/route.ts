import { NextResponse } from 'next/server';
import type { BlogPost, PaginatedResponse } from '@/app/types/blog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    const postsWithImages: BlogPost[] = paginatedPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      imageUrl: `https://picsum.photos/seed/${post.id}/500/300`,
    }));

    const responseData: PaginatedResponse = {
      posts: postsWithImages,
      total: posts.length,
      page,
      limit,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 