'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box,
  Skeleton,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import type { BlogPost, PaginatedResponse } from '@/app/types/blog';
import { ArticleCardSkeleton } from '@/app/components/ArticleCardSkeleton';
import NextLink from 'next/link';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [page, limit]);

  const fetchPosts = async () => {
    setLoading(true);
    setImagesLoaded({});
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
      const data: PaginatedResponse = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleImageLoad = (id: number) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6 mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <Breadcrumbs
            aria-label='breadcrumb'
            className='dark:text-white'>
            <Link
              component={NextLink}
              href='/'
              className='dark:text-gray-400 hover:dark:text-white'>
              Home
            </Link>
            <Typography className='dark:text-white'>Articles</Typography>
          </Breadcrumbs>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-6'>
          <FormControl className='w-48'>
            <InputLabel className='dark:text-white'>Articles per page</InputLabel>
            <Select
              value={limit}
              label='Articles per page'
              onChange={handleLimitChange}
              className='dark:bg-gray-800 dark:text-white'>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>

          {loading ? (
            <Box className='flex items-center gap-2'>
              <CircularProgress
                size={20}
                className='dark:text-white'
              />
              <Typography className='dark:text-white'>Loading...</Typography>
            </Box>
          ) : (
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={handlePageChange}
              color='primary'
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgb(25, 118, 210) !important',
                  color: 'white !important',
                  '&:hover': {
                    backgroundColor: 'rgb(21, 101, 192) !important',
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: 'inherit',
                },
                '& .MuiPaginationItem-icon': {
                  color: 'inherit',
                },
              }}
              className='dark:text-white'
            />
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {loading
          ? Array.from({ length: limit }).map((_, index) => <ArticleCardSkeleton key={index} />)
          : posts.map((post) => (
              <Card
                key={post.id}
                className='dark:bg-gray-800 flex flex-col'>
                <div className='relative h-[200px]'>
                  {!imagesLoaded[post.id] && (
                    <Skeleton
                      variant='rectangular'
                      height={200}
                      className='dark:bg-gray-700 absolute inset-0'
                    />
                  )}
                  <CardMedia
                    component='img'
                    height='200'
                    image={post.imageUrl}
                    alt={post.title}
                    onLoad={() => handleImageLoad(post.id)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      imagesLoaded[post.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
                <CardContent className='flex flex-col flex-grow'>
                  <Typography
                    variant='h6'
                    className='dark:text-white'>
                    {post.title}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    className='dark:text-gray-300 mt-2 flex-grow'>
                    {post.body.substring(0, 100)}...
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
    </div>
  );
}
