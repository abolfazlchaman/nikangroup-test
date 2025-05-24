'use client';

import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from './SearchBar';

interface ArticlesControlsProps {
  total: number;
  currentPage: number;
  currentLimit: number;
}

export function ArticlesControls({ total, currentPage, currentLimit }: ArticlesControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = event.target.value as number;
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reset to first page when changing limit
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className='flex flex-col gap-6 mb-8'>
      <div className='flex flex-col gap-4'>
        <div className='w-full lg:hidden'>
          <SearchBar variant='page' />
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
          <div className='flex items-center gap-4 w-full sm:w-auto'>
            <FormControl
              size='small'
              className='w-48'>
              <InputLabel className='dark:text-white'>Articles per page</InputLabel>
              <Select
                value={currentLimit}
                label='Articles per page'
                onChange={handleLimitChange}
                className='dark:bg-gray-800 dark:text-white'>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Typography className='dark:text-white text-sm whitespace-nowrap hidden lg:block'>
              Articles {Math.min((currentPage - 1) * currentLimit + 1, total)}-
              {Math.min(currentPage * currentLimit, total)} from {total}
            </Typography>
          </div>

          <div className='flex items-center gap-4'>
            <div className='hidden lg:block w-64 [&_.MuiInputBase-root]:!pt-0 [&_.MuiInputBase-root]:!pb-0 [&_.MuiInputBase-root]:!min-h-0'>
              <SearchBar variant='page' />
            </div>
            <Pagination
              count={Math.ceil(total / currentLimit)}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
              size='small'
              siblingCount={0}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgb(25, 118, 210) !important',
                  color: 'white !important',
                  '&:hover': {
                    backgroundColor: 'rgb(21, 101, 192) !important',
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: 'inherit',
                },
                '& .MuiPaginationItem-icon': {
                  color: 'inherit',
                },
              }}
              className='dark:text-white'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
