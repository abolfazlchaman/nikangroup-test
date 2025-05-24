import { Card, CardContent, Skeleton } from '@mui/material';

export function ArticleCardSkeleton() {
  return (
    <Card className='dark:bg-gray-800 flex flex-col'>
      <Skeleton
        variant='rectangular'
        height={200}
        className='dark:bg-gray-700'
      />
      <CardContent className='flex flex-col flex-grow'>
        <Skeleton
          variant='text'
          height={32}
          className='dark:bg-gray-700 mb-2'
        />
        <Skeleton
          variant='text'
          height={100}
          className='dark:bg-gray-700 mt-2'
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
