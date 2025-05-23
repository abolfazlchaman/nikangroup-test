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

  if (!mounted) {
    return (
      <button
        className='w-10 h-10 rounded-md flex items-center justify-center'
        aria-label='Toggle theme'>
        <LightMode className='h-5 w-5 text-muted-foreground' />
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
