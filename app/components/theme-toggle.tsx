'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LightMode, DarkMode } from '@mui/icons-material';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during server-side rendering
  if (!mounted) {
    return (
      <button
        className='w-10 h-10 rounded-md flex items-center justify-center animate-pulse'
        aria-label='Loading theme'>
        <div className='h-5 w-5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin' />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='w-10 h-10 rounded-md flex items-center justify-center hover:bg-accent transition-colors'
      aria-label='Toggle theme'>
      {theme === 'dark' ? (
        <LightMode className='h-5 w-5 text-muted-foreground' />
      ) : (
        <DarkMode className='h-5 w-5 text-muted-foreground' />
      )}
    </button>
  );
}
