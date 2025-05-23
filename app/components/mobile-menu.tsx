'use client';

import { Menu } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  navItems: { label: string; href: string }[];
}

export function MobileMenu({ navItems }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className='md:hidden'>
      <button
        onClick={() => setOpen(!open)}
        className='w-10 h-10 rounded-md flex items-center justify-center hover:bg-accent transition-colors'
        aria-label='Toggle menu'>
        <Menu className='h-5 w-5 text-muted-foreground' />
      </button>

      {open && (
        <div className='absolute right-4 top-16 w-48 rounded-md border bg-background p-2 shadow-lg'>
          <nav className='flex flex-col gap-1'>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className='rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors'>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
