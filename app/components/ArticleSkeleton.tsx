import { Card, CardContent, Skeleton } from '@mui/material';

export function ArticleSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Skeleton
        variant='rectangular'
        height={36}
        width={120}
        className='dark:bg-gray-700 mb-6'
      />
      <Card className='dark:bg-gray-800'>
        <Skeleton
          variant='rectangular'
          height={400}
          className='dark:bg-gray-700'
        />
        <CardContent>
          <Skeleton
            variant='text'
            height={48}
            className='dark:bg-gray-700 mb-4'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-2'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-2'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-2'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700'
          />
        </CardContent>
      </Card>
    </div>
  );
}
