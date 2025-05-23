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
import { useRouter, useSearchParams } from 'next/navigation';
import type { BlogPost, PaginatedResponse } from '@/app/types/blog';
import { ArticleCardSkeleton } from '@/app/components/ArticleCardSkeleton';
import { SearchBar } from '@/app/components/SearchBar';
import NextLink from 'next/link';

export default function ArticlesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchPosts();
  }, [page, limit, searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    setImagesLoaded({});
    try {
      const endpoint = searchQuery
        ? `/api/posts/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`
        : `/api/posts?page=${page}&limit=${limit}`;
      const response = await fetch(endpoint);
      const data: PaginatedResponse = await response.json();
      setPosts(data.posts);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
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

        <div className='flex flex-col gap-4'>
          <div className='w-full lg:hidden'>
            <SearchBar variant='page' />
          </div>

          <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
            <div className='flex items-center gap-4 w-full sm:w-auto'>
              <FormControl
                size='small'
                className='w-48'>
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

              {isInitialLoad ? (
                <Box className='flex items-center gap-2 hidden sm:flex'>
                  <CircularProgress
                    size={20}
                    className='dark:text-white'
                  />
                  <Typography className='dark:text-white text-sm'>Loading...</Typography>
                </Box>
              ) : (
                <Typography className='dark:text-white text-sm whitespace-nowrap hidden lg:block'>
                  Articles {Math.min((page - 1) * limit + 1, total)}-{Math.min(page * limit, total)}{' '}
                  from {total}
                </Typography>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <div className='hidden lg:block w-64 [&_.MuiInputBase-root]:!pt-0 [&_.MuiInputBase-root]:!pb-0 [&_.MuiInputBase-root]:!min-h-0'>
                <SearchBar variant='page' />
              </div>
              {isInitialLoad ? (
                <Box className='flex items-center gap-2'>
                  <CircularProgress
                    size={20}
                    className='dark:text-white'
                  />
                </Box>
              ) : (
                <Pagination
                  count={Math.ceil(total / limit)}
                  page={page}
                  onChange={handlePageChange}
                  color='primary'
                  size='small'
                  siblingCount={0}
                  boundaryCount={1}
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
        </div>
      </div>

      {searchQuery && !loading && (
        <Typography
          variant='h6'
          className='text-center mb-6 dark:text-white'>
          {total === 0
            ? 'No results found'
            : `Found ${total} ${total === 1 ? 'result' : 'results'} for "${searchQuery}"`}
        </Typography>
      )}

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
