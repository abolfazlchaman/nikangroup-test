import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ArticlesPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import type { Mock } from 'vitest';

const theme = createTheme();

const renderWithProviders = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock sessionStorage
global.sessionStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

describe('Articles Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset sessionStorage mocks
    (global.sessionStorage.getItem as Mock).mockImplementation(() => null);
    (global.sessionStorage.setItem as Mock).mockImplementation(() => {});
    // Mock router
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
      prefetch: vi.fn(),
    });
    // Mock search params
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(''),
    });
  });

  it('renders loading state initially', () => {
    renderWithProviders(<ArticlesPage />);
    // The ArticleCardSkeleton should have data-testid="article-skeleton"
    expect(screen.getAllByTestId('article-skeleton')).toHaveLength(10); // Default limit
  });

  it('renders articles after loading', async () => {
    const mockPosts = {
      posts: [
        {
          id: 1,
          title: 'Test Article',
          body: 'Test Content',
          imageUrl: 'test.jpg',
        },
      ],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockPosts),
    });

    renderWithProviders(<ArticlesPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    const mockSearchResults = {
      posts: [
        {
          id: 1,
          title: 'Search Result',
          body: 'Search Content',
          imageUrl: 'search.jpg',
        },
      ],
      total: 1,
    };

    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('test'),
    });

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSearchResults),
    });

    renderWithProviders(<ArticlesPage />);

    await waitFor(() => {
      expect(screen.getByText('Search Result')).toBeInTheDocument();
    });
  });
});
