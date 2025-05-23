'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LightMode, DarkMode } from '@mui/icons-material';
import { IconButton, Skeleton } from '@mui/material';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton
        variant='circular'
        width={40}
        height={40}
      />
    );
  }

  return (
    <IconButton
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      sx={{
        color: 'inherit',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      }}
      aria-label='Toggle theme'>
      {theme === 'dark' ? (
        <LightMode sx={{ color: 'inherit' }} />
      ) : (
        <DarkMode sx={{ color: 'inherit' }} />
      )}
    </IconButton>
  );
}
