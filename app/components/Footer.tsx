'use client';

export function Footer() {
  return (
    <footer className='w-full py-6 px-4 mt-auto border-t border-border bg-background'>
      <p className='text-center text-foreground'>
        {'© '}
        {new Date().getFullYear()}
        {' Nikan Group Test | Abolfazl Chaman'}
      </p>
    </footer>
  );
}
