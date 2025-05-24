import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import type { BlogPost } from '../types/blog';

async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=10`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });

  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  return res.json();
}

export async function ArticlesList() {
  const { posts } = await getArticles();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {posts.map((post: BlogPost) => (
        <Card
          key={post.id}
          className='dark:bg-gray-800 flex flex-col'>
          <div className='relative h-[200px]'>
            <CardMedia
              component='img'
              height='200'
              image={`https://picsum.photos/seed/${post.id}/1920/1080`}
              alt={post.title}
              className='absolute inset-0 w-full h-full object-cover'
            />
          </div>
          <CardContent className='flex flex-col flex-grow'>
            <Typography
              variant='h6'
              component='h2'
              className='dark:text-white font-bold mb-2'>
              {post.title}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              className='dark:text-gray-300 mt-2 flex-grow'>
              {post.body ? `${post.body.substring(0, 100)}...` : 'No content available'}
            </Typography>
            <Box className='mt-4'>
              <Link href={`/articles/${post.id}`}>
                <Button variant='contained'>Read More</Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
