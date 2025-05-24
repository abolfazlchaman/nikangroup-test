'use client';

import { useState, useEffect, Suspense } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import type { BlogPost, PaginatedResponse } from './types/blog';
import { ArticleCardSkeleton } from './components/ArticleCardSkeleton';
import { SearchBar } from './components/SearchBar';

// Cache for articles list
const articlesCache = new Map<string, PaginatedResponse>();

function ArticlesContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(sessionStorage.getItem('articles_page')) || 1;
    }
    return 1;
  });
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const storedLimit = sessionStorage.getItem('articles_limit');
    if (storedLimit) {
      setLimit(Number(storedLimit));
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setImagesLoaded({});
      try {
        const endpoint = searchQuery
          ? `/api/posts/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`
          : `/api/posts?page=${page}&limit=${limit}`;

        // Check cache first
        const cacheKey = `${endpoint}`;
        if (articlesCache.has(cacheKey)) {
          const cachedData = articlesCache.get(cacheKey)!;
          setPosts(cachedData.posts);
          setTotal(cachedData.total);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PaginatedResponse = await response.json();

        // Cache the response
        articlesCache.set(cacheKey, data);

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
        setIsInitialLoad(false);
      }
    };

    fetchPosts();
  }, [page, limit, searchQuery]);

  // Prefetch article pages
  useEffect(() => {
    if (!loading && posts.length > 0) {
      posts.forEach((post) => {
        const path = `/articles/${post.id}`;
        router.prefetch(path);
      });
    }
  }, [posts, loading, router]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    sessionStorage.setItem('articles_page', value.toString());
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    setPage(1);
    sessionStorage.setItem('articles_limit', newLimit.toString());
    sessionStorage.setItem('articles_page', '1');
  };

  const handleImageLoad = (id: number) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-6 mb-8'>
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
        {loading ? (
          Array.from({ length: limit }).map((_, index: number) => (
            <ArticleCardSkeleton key={index} />
          ))
        ) : error ? (
          <Typography
            variant='h6'
            className='text-center col-span-full dark:text-white'>
            {error}
          </Typography>
        ) : (
          posts.map((post) => (
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
                    onClick={() => {
                      const targetPath = `/articles/${post.id}`;
                      router.prefetch(targetPath);
                      router.push(targetPath);

                      // Store the data after navigation starts with high quality image
                      queueMicrotask(() => {
                        sessionStorage.setItem(
                          `article_${post.id}`,
                          JSON.stringify({
                            ...post,
                            imageUrl: `https://picsum.photos/seed/${post.id}/1920/1080`,
                          }),
                        );
                      });
                    }}>
                    Read More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<ArticleCardSkeleton />}>
      <ArticlesContent />
    </Suspense>
  );
}
