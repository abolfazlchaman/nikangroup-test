import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { ArticleImage } from '@/app/components/ArticleImage';
import { Breadcrumb } from '../../components/Breadcrumb';
import type { BlogPost } from '../../types/blog';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

// This generates metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id).catch(() => null);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.title,
    description: post.body.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.body.substring(0, 160),
      images: [post.imageUrl],
    },
  };
}

async function getPost(id: string): Promise<BlogPost> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 60 },
    // Add cache: 'force-cache' to ensure SSR
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  const post = await res.json();
  return {
    id: post.id,
    title: post.title,
    body: post.body,
    imageUrl: `https://picsum.photos/seed/${post.id}/1200/800`,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id).catch(() => null);
  const headersList = await headers();
  const referer = headersList.get('referer') || '/';
  const searchParams = new URL(referer).searchParams;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search') || '';

  if (!post) {
    notFound();
  }

  const backUrl = `/?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;

  return (
    <div className='container mx-auto px-4 py-8'>
      <Breadcrumb items={[{ label: 'Articles', href: backUrl }, { label: post.title }]} />
      <br />
      <Card className='dark:bg-gray-800'>
        <ArticleImage
          imageUrl={post.imageUrl}
          title={post.title}
        />
        <CardContent className='max-w-3xl mx-auto'>
          <Typography
            variant='h4'
            component='h1'
            className='dark:text-white font-bold mb-6'>
            {post.title}
          </Typography>
          <br />
          <br />
          <Typography
            variant='body1'
            className='dark:text-gray-300 whitespace-pre-line mb-8'>
            {post.body}
          </Typography>
          <br />
          <Box className='flex justify-center'>
            <Button
              variant='contained'
              href={backUrl}
              className='dark:bg-blue-600 dark:hover:bg-blue-700'>
              Back to Articles
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
