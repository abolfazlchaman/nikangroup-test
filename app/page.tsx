import { Suspense } from 'react';
import type { BlogPost } from './types/blog';
import { ArticleCardSkeleton } from './components/ArticleCardSkeleton';
import { ArticlesList } from './components/ArticlesList';
import { ArticlesControls } from './components/ArticlesControls';
import { ArticleCard } from './components/ArticleCard';
import { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Articles List',
    description: 'Browse our collection of articles',
  };
}

// Server Component for initial data fetching
async function getInitialPosts(page: number = 1, limit: number = 10) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    next: { revalidate: 60 },
    cache: 'force-cache', // Ensure SSR
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await res.json();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  const postsWithImages: BlogPost[] = paginatedPosts.map(
    (post: { id: number; title: string; body: string }) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      imageUrl: `https://picsum.photos/seed/${post.id}/800/600`,
    }),
  );

  return {
    posts: postsWithImages,
    total: posts.length,
    page,
    limit,
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const searchQuery = params.search || '';

  // If there's a search query, we'll let the client component handle it
  if (searchQuery) {
    return (
      <Suspense fallback={<ArticleCardSkeleton />}>
        <ArticlesList searchQuery={searchQuery} />
      </Suspense>
    );
  }

  // Server-side data fetching for initial load
  const initialData = await getInitialPosts(page, limit);

  return (
    <div className='container mx-auto px-4 py-8'>
      <ArticlesControls
        total={initialData.total}
        currentPage={page}
        currentLimit={limit}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {initialData.posts.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
