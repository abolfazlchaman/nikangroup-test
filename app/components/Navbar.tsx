'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Skeleton,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { SearchBar } from './SearchBar';

function NavbarSkeleton() {
  return (
    <AppBar
      position='static'
      className='dark:bg-gray-900'>
      <Toolbar>
        <Skeleton
          variant='circular'
          width={40}
          height={40}
          sx={{ mr: 2 }}
        />
        <Skeleton
          variant='text'
          width={120}
          height={32}
          sx={{ flexGrow: 1 }}
        />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              variant='text'
              width={80}
              height={32}
            />
          ))}
          <Skeleton
            variant='circular'
            width={40}
            height={40}
            sx={{ ml: 2 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Articles', path: '/articles' },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: 'center' }}>
      <Typography
        variant='h6'
        component={Link}
        href='/'
        className='my-2 block text-black no-underline'>
        Nikangroup
      </Typography>
      <Divider className='mb-2' />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.path}
            disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              className={`text-center ${
                pathname === item.path
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-black hover:bg-accent'
              }`}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton className='text-center hover:bg-accent'>
            <ListItemText
              primary={
                <Box className='flex items-center justify-center'>
                  <ThemeToggle />
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  if (!mounted) {
    return <NavbarSkeleton />;
  }

  return (
    <AppBar
      position='static'
      className='dark:bg-gray-900'>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant='h6'
          component={Link}
          href='/'
          className='flex-grow text-foreground no-underline'>
          Nikangroup
        </Typography>
        <Box className='hidden md:flex gap-2 items-center'>
          {pathname !== '/articles' && (
            <SearchBar
              variant='navbar'
              className='w-64'
            />
          )}
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-2 py-1 rounded-md transition-colors ${
                pathname === item.path
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'text-foreground hover:bg-accent'
              }`}>
              {item.label}
            </Link>
          ))}
          <Box className='ml-2'>
            <ThemeToggle />
          </Box>
        </Box>
      </Toolbar>

      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'background.paper',
          },
        }}>
        {drawer}
      </Drawer>
    </AppBar>
  );
}
