'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Skeleton } from '@mui/material';
import type { BlogPost } from '../types/blog';

interface ArticleCardProps {
  post: BlogPost;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = post.imageUrl;

    const handleLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // If the image is already cached, it might not trigger the load event
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [post.imageUrl]);

  return (
    <Card className='dark:bg-gray-800 flex flex-col'>
      <div className='relative h-[300px]'>
        {(!imageLoaded || imageError) && (
          <Skeleton
            variant='rectangular'
            sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
            className='dark:bg-gray-700'
          />
        )}
        <CardMedia
          component='img'
          image={post.imageUrl}
          alt={post.title}
          sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
          }`}
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
            href={`/articles/${post.id}`}>
            Read More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
