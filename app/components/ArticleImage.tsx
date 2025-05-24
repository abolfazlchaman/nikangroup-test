'use client';

import { useState, useEffect } from 'react';
import { CardMedia, IconButton, Modal, Box, Fade, Skeleton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';

interface ArticleImageProps {
  imageUrl: string;
  title: string;
}

export function ArticleImage({ imageUrl, title }: ArticleImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    const handleLoad = () => {
      setMainImageLoaded(true);
      setImageError(false);
    };

    const handleError = () => {
      setImageError(true);
      setMainImageLoaded(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // If the image is already cached, it might not trigger the load event
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageUrl]);

  // Handle modal image loading separately
  useEffect(() => {
    if (!isModalOpen) {
      setModalImageLoaded(false);
      return;
    }

    const img = new Image();
    img.src = imageUrl;

    const handleLoad = () => {
      setModalImageLoaded(true);
    };

    const handleError = () => {
      setModalImageLoaded(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageUrl, isModalOpen]);

  return (
    <>
      <div className='relative h-[500px] md:h-[600px]'>
        {(!mainImageLoaded || imageError) && (
          <Skeleton
            variant='rectangular'
            sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
            className='dark:bg-gray-700'
          />
        )}
        <CardMedia
          component='img'
          image={imageUrl}
          alt={title}
          sx={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
          className={`object-cover transition-opacity duration-300 ${
            mainImageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <IconButton
          onClick={() => setIsModalOpen(true)}
          className='absolute top-0 right-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 z-10'
          size='medium'>
          <ZoomInIcon />
        </IconButton>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className='flex items-center justify-center p-4'
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
          className: 'bg-black/90',
        }}>
        <Fade in={isModalOpen}>
          <Box className='relative max-w-[90vw] max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-lg'>
            <IconButton
              onClick={() => setIsModalOpen(false)}
              className='absolute top-0 right-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 z-10'
              size='medium'>
              <CloseIcon />
            </IconButton>
            {!modalImageLoaded && (
              <Box className='flex items-center justify-center w-full h-64'>
                <Skeleton
                  variant='rectangular'
                  sx={{ height: '100%', width: '100%' }}
                  className='dark:bg-gray-700'
                />
              </Box>
            )}
            <Box className='relative w-full'>
              <CardMedia
                component='img'
                image={imageUrl}
                alt={title}
                sx={{ height: 'auto', maxHeight: '90vh', width: '100%' }}
                className={`object-contain transition-opacity duration-300 ${
                  modalImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
