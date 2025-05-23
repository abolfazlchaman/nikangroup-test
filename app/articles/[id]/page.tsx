'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Skeleton,
  Breadcrumbs,
  Link,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/app/types/blog';
import { ArticleSkeleton } from '@/app/components/ArticleSkeleton';
import NextLink from 'next/link';
import { use } from 'react';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.id]);

  const fetchPost = async () => {
    setLoading(true);
    setImageLoaded(false);
    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`);
      const data: BlogPost = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-4 mb-6'>
        <Breadcrumbs
          aria-label='breadcrumb'
          className='dark:text-white'>
          <Link
            component={NextLink}
            href='/'
            className='dark:text-gray-400 hover:dark:text-white'>
            Home
          </Link>
          <Link
            component={NextLink}
            href='/articles'
            className='dark:text-gray-400 hover:dark:text-white'>
            Articles
          </Link>
          {loading ? (
            <Box className='flex items-center gap-2'>
              <CircularProgress
                size={16}
                className='dark:text-white'
              />
              <Typography className='dark:text-white'>Loading...</Typography>
            </Box>
          ) : (
            <Typography className='dark:text-white'>
              {post ? truncateTitle(post.title) : 'Article not found'}
            </Typography>
          )}
        </Breadcrumbs>
      </div>

      {loading ? (
        <ArticleSkeleton />
      ) : post ? (
        <Card className='dark:bg-gray-800'>
          <div className='relative h-[500px] md:h-[600px]'>
            {!imageLoaded && (
              <Skeleton
                variant='rectangular'
                height='100%'
                className='dark:bg-gray-700 absolute inset-0'
              />
            )}
            <CardMedia
              component='img'
              image={post.imageUrl}
              alt={post.title}
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
          <CardContent className='max-w-4xl mx-auto px-6 py-8'>
            <Typography
              variant='h4'
              className='dark:text-white mb-8 text-justify'
              sx={{
                marginY: '4rem',
              }}>
              {post.title}
              <Divider
                sx={{
                  mt: '1rem',
                }}
              />
            </Typography>
            <Typography
              variant='body1'
              className='dark:text-gray-300 whitespace-pre-line text-justify leading-relaxed'>
              {post.body}
            </Typography>
            <Box className='flex justify-center mt-8 mb-4'>
              <Button
                variant='outlined'
                onClick={() => router.push('/articles')}
                className='dark:text-white dark:border-white hover:dark:bg-white/10'>
                Back to Articles
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <div className='text-center py-8'>
          <Typography
            variant='h5'
            className='dark:text-white'>
            Article not found
          </Typography>
        </div>
      )}
    </div>
  );
}
