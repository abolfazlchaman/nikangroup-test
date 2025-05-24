'use client';

import { useState, useEffect, useRef } from 'react';
import { TextField, Autocomplete, CircularProgress, Box, Typography, Paper } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import type { BlogPost } from '@/app/types/blog';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  className?: string;
  variant?: 'navbar' | 'page';
}

export function SearchBar({ className = '', variant = 'page' }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize query from URL search params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (query.length < 2) {
      setOptions([]);
      setTotal(0);
      setHasSearched(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    setHasSearched(false);
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}&limit=5`);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        const data = await response.json();
        setOptions(data.posts);
        setTotal(data.total);
        setHasSearched(true);
      } catch (error) {
        console.error('Search failed:', error);
        setOptions([]);
        setTotal(0);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const handleOptionClick = (post: BlogPost) => {
    router.push(`/articles/${post.id}`);
    setOpen(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/articles?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const getNoOptionsText = () => {
    if (loading) {
      return 'Searching...';
    }
    if (query.length < 2) {
      return 'Start typing to search...';
    }
    if (hasSearched && total === 0) {
      return 'No results found';
    }
    return '';
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    try {
      const escapedQuery = escapeRegExp(query);
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className='bg-primary/20 text-primary font-medium'>
            {part}
          </span>
        ) : (
          part
        ),
      );
    } catch (error) {
      console.error('Error highlighting text:', error);
      return text;
    }
  };

  return (
    <Box className={`relative ${className}`}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        getOptionLabel={(option) => option.title}
        filterOptions={(x) => x}
        noOptionsText={
          <Typography className='text-muted-foreground py-2 px-4'>{getNoOptionsText()}</Typography>
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder='Search articles...'
            variant={variant === 'navbar' ? 'outlined' : 'filled'}
            size={variant === 'navbar' ? 'small' : 'medium'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon className='text-muted-foreground mr-2' />,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress
                      color='inherit'
                      size={20}
                      className='mr-2 text-foreground'
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            className='w-full'
            sx={{
              '& .MuiInputBase-input': {
                color: 'hsl(var(--foreground))',
                '&::placeholder': {
                  color: 'hsl(var(--foreground))',
                  opacity: 1,
                },
              },
              '& .MuiInputBase-root': {
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--foreground))',
                '&:hover': {
                  backgroundColor: 'hsl(var(--accent))',
                },
                '&.Mui-focused': {
                  backgroundColor: 'hsl(var(--accent))',
                },
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'hsl(var(--border))',
                },
                '&:hover fieldset': {
                  borderColor: 'hsl(var(--border))',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'hsl(var(--primary))',
                },
              },
              '& .MuiFilledInput-root': {
                backgroundColor: 'hsl(var(--muted))',
                '&:hover': {
                  backgroundColor: 'hsl(var(--accent))',
                },
                '&.Mui-focused': {
                  backgroundColor: 'hsl(var(--accent))',
                },
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box
              key={key}
              component='li'
              {...otherProps}
              onClick={() => handleOptionClick(option)}
              className='cursor-pointer hover:bg-accent transition-colors duration-150'>
              <Box className='flex flex-col p-2'>
                <Typography className='font-medium text-foreground'>
                  <span className='text-muted-foreground mr-2'>#{option.id}:</span>
                  {highlightText(option.title, query)}
                </Typography>
                <Typography
                  variant='body2'
                  className='text-muted-foreground'>
                  {option.body ? highlightText(option.body.substring(0, 60), query) : ''}
                </Typography>
              </Box>
            </Box>
          );
        }}
        PaperComponent={({ children }) => (
          <Paper
            elevation={2}
            sx={{
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              marginTop: '8px',
            }}>
            {children}
            {hasSearched && total > 0 && (
              <Box
                sx={{
                  padding: '8px',
                  borderTop: '1px solid hsl(var(--border))',
                }}>
                <Typography
                  variant='body2'
                  sx={{ color: 'hsl(var(--muted-foreground))' }}>
                  {total} {total === 1 ? 'result' : 'results'} found
                </Typography>
              </Box>
            )}
          </Paper>
        )}
        ListboxProps={{
          sx: {
            color: 'hsl(var(--foreground))',
            backgroundColor: 'hsl(var(--background))',
          },
        }}
        componentsProps={{
          paper: {
            sx: {
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
            },
          },
        }}
      />
    </Box>
  );
}
