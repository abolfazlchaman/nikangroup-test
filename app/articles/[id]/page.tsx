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
  Modal,
  IconButton,
  Fade,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/app/types/blog';
import { ArticleSkeleton } from '@/app/components/ArticleSkeleton';
import NextLink from 'next/link';
import { use } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializePost = async () => {
      setLoading(true);
      setImageLoaded(false);

      try {
        // Check if we have the post in sessionStorage (from articles list)
        const storedPost = sessionStorage.getItem(`article_${resolvedParams.id}`);
        if (storedPost) {
          const parsedPost = JSON.parse(storedPost) as BlogPost;
          setPost(parsedPost);
          setLoading(false);
          return;
        }

        // Otherwise fetch the article
        const response = await fetch(`/api/posts/${resolvedParams.id}`);
        const data: BlogPost = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePost();
  }, [resolvedParams.id]);

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
            <IconButton
              onClick={() => setIsImageModalOpen(true)}
              className='absolute top-0 left-0 bg-background text-foreground z-10 backdrop-blur-sm rounded-full p-2 shadow-lg'
              size='large'>
              <ZoomInIcon className='text-2xl' />
            </IconButton>
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

      <Modal
        open={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        className='flex items-center justify-center p-4'
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
          className: 'bg-black/80',
        }}>
        <Fade in={isImageModalOpen}>
          <Box className='relative max-w-[90vw] max-h-[90vh] overflow-y-auto bg-black/90 rounded-lg p-4 my-4'>
            <IconButton
              onClick={() => setIsImageModalOpen(false)}
              className='absolute -top-0 right-0 dark:text-white hover:bg-white/10'
              size='large'>
              <CloseIcon />
            </IconButton>
            {!modalImageLoaded && (
              <Box className='flex items-center justify-center w-full h-[60vh]'>
                <CircularProgress className='dark:text-white' />
              </Box>
            )}
            <Box className='relative w-full h-full'>
              <img
                src={post?.imageUrl}
                alt={post?.title}
                onLoad={() => setModalImageLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  modalImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
