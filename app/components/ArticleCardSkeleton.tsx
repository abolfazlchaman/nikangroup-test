import { Card, CardContent, Skeleton } from '@mui/material';

export function ArticleCardSkeleton() {
  return (
    <Card
      className='dark:bg-gray-800 flex flex-col'
      data-testid='article-card-skeleton'>
      <div className='relative h-[200px]'>
        <Skeleton
          variant='rectangular'
          height={200}
          className='dark:bg-gray-700 absolute inset-0'
        />
      </div>
      <CardContent className='flex flex-col flex-grow'>
        <Skeleton
          variant='text'
          height={32}
          className='dark:bg-gray-700 mb-2'
        />
        <Skeleton
          variant='text'
          height={80}
          className='dark:bg-gray-700 mt-2 flex-grow'
        />
        <Skeleton
          variant='rectangular'
          height={36}
          width={120}
          className='dark:bg-gray-700 mt-4'
        />
      </CardContent>
    </Card>
  );
}
