import { Breadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      className='mb-4 dark:text-gray-300'>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast) {
          return (
            <Typography
              key={item.label}
              color='text.primary'
              className='dark:text-white'>
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={item.label}
            component={NextLink}
            href={item.href || '#'}
            underline='hover'
            color='inherit'
            className='dark:text-gray-300 hover:dark:text-white'>
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
