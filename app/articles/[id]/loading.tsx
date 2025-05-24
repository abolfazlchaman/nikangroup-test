import { Card, CardContent, Skeleton, Box } from '@mui/material';
import { Breadcrumb } from '../../components/Breadcrumb';

export default function ArticleLoading() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Breadcrumb items={[{ label: 'Articles', href: '/' }, { label: 'Loading...' }]} />
      <br />
      <Card className='dark:bg-gray-800'>
        <div className='relative h-[500px] md:h-[600px]'>
          <Skeleton
            variant='rectangular'
            sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
            className='dark:bg-gray-700'
          />
        </div>
        <CardContent className='max-w-3xl mx-auto'>
          <Skeleton
            variant='text'
            height={48}
            className='dark:bg-gray-700 mb-6'
          />
          <br />
          <br />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-4'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-4'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-4'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-4'
          />
          <Skeleton
            variant='text'
            height={24}
            className='dark:bg-gray-700 mb-4'
          />
          <br />
          <Box className='flex justify-center'>
            <Skeleton
              variant='rectangular'
              height={36}
              width={120}
              className='dark:bg-gray-700'
            />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
