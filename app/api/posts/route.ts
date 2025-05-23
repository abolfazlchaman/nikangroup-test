import { NextRequest, NextResponse } from 'next/server';
import type { BlogPost, PaginatedResponse } from '@/app/types/blog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  // Validate page parameter
  const page = parseInt(pageParam || '1');
  if (isNaN(page) || page < 1) {
    return NextResponse.json(
      { error: 'Invalid page parameter' },
      { status: 400 }
    );
  }

  // Validate limit parameter
  const limit = parseInt(limitParam || '10');
  if (isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid limit parameter' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    const postsWithImages: BlogPost[] = paginatedPosts.map((post: { id: number; title: string; body: string }) => ({
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 