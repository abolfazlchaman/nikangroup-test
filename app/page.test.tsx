import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';
import type { PaginatedResponse } from './types/blog';

const theme = createTheme();

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRouter and useSearchParams
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(''),
  }),
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockArticles: PaginatedResponse = {
  posts: [
    {
      id: 1,
      title: 'Test Article 1',
      body: 'Test content 1',
      imageUrl: '/test-image-1.jpg',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      title: 'Test Article 2',
      body: 'Test content 2',
      imageUrl: '/test-image-2.jpg',
      createdAt: '2024-01-02',
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    });
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  it('renders loading skeletons initially', () => {
    renderWithProviders(<Home />);
    expect(screen.getAllByTestId('article-card-skeleton')).toHaveLength(10); // Default limit
  });

  it('renders articles after loading', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });

    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();
  });

  it('handles image loading states', async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // Two articles with images

    // Simulate image load
    fireEvent.load(images[0]);
    expect(images[0]).toHaveClass('opacity-100');
  });
});
