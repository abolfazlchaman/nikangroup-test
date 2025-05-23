import { NextResponse } from 'next/server';
import type { BlogPost } from '@/app/types/blog';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${params.id}`
    );
    const post = await response.json();

    const postWithImage: BlogPost = {
      id: post.id,
      title: post.title,
      body: post.body,
      imageUrl: `https://picsum.photos/seed/${post.id}/1200/600`,
    };

    return NextResponse.json(postWithImage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
} 