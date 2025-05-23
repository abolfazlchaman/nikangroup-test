import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

const theme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Home Page', () => {
  it('renders the main heading', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('Nikan Group Test')).toBeInTheDocument();
  });

  it('renders the description text', () => {
    renderWithProviders(<Home />);
    expect(
      screen.getByText('A test project for Nikan Group by Abolfazl Chaman'),
    ).toBeInTheDocument();
  });

  it('renders the View Articles button', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('View Articles')).toBeInTheDocument();
  });

  it('renders the Next.js logo image', () => {
    renderWithProviders(<Home />);
    const image = screen.getByAltText('Next.js logo');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain('/android-chrome-512x512.png');
  });
});
