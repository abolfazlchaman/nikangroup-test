'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { BlogPost, PaginatedResponse } from '../types/blog';

interface ArticlesListProps {
  searchQuery: string;
}

export function ArticlesList({ searchQuery }: ArticlesListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PaginatedResponse = await response.json();
        setPosts(data.posts);
        setTotal(data.total);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to load articles');
        setPosts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className='dark:bg-gray-800 flex flex-col'>
            <Skeleton
              variant='rectangular'
              height={200}
              className='dark:bg-gray-700'
            />
            <CardContent>
              <Skeleton
                variant='text'
                height={24}
                className='dark:bg-gray-700 mb-2'
              />
              <Skeleton
                variant='text'
                height={24}
                className='dark:bg-gray-700 mb-2'
              />
              <Skeleton
                variant='text'
                height={24}
                className='dark:bg-gray-700'
              />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Typography
        variant='h6'
        className='text-center col-span-full dark:text-white'>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant='h6'
        className='text-center mb-6 dark:text-white'>
        {total === 0
          ? 'No results found'
          : `Found ${total} ${total === 1 ? 'result' : 'results'} for "${searchQuery}"`}
      </Typography>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Card
            key={post.id}
            className='dark:bg-gray-800 flex flex-col'>
            <div className='relative h-[200px]'>
              <CardMedia
                component='img'
                height='200'
                image={post.imageUrl}
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
                <Button
                  variant='contained'
                  onClick={() => router.push(`/articles/${post.id}`)}>
                  Read More
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
