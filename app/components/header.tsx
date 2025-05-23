'use client';

import { ThemeToggle } from './theme-toggle';
import { MobileMenu } from './mobile-menu';
import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/' },
  { label: 'Contact', href: '/' },
];

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4 min-w-full'>
        {/* Logo/Title */}
        <Link
          href='/'
          className='text-xl font-bold text-foreground hover:text-primary transition-colors'>
          NIKAN GROUP
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <MobileMenu navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
