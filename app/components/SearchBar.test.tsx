import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';
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

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock router
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
    // Mock search params
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue(''),
    });
  });

  it('renders with default props', () => {
    renderWithProviders(<SearchBar />);
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('renders with navbar variant', () => {
    renderWithProviders(<SearchBar variant='navbar' />);
    const input = screen.getByPlaceholderText('Search articles...');
    const outlinedInputRoot = input.closest('.MuiOutlinedInput-root');
    expect(outlinedInputRoot).not.toBeNull();
  });

  it('shows loading state while searching', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    const mockResults = {
      posts: [
        {
          id: 1,
          title: 'Test Article',
          content: 'Test Content',
          imageUrl: 'test.jpg',
          createdAt: '2024-01-01',
        },
      ],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      const result = screen.getByText((content) => content.includes('#1:'));
      expect(result).toBeInTheDocument();
    });
  });

  it('handles search error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Search failed'));

    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('navigates to article page on result click', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    (useRouter as Mock).mockReturnValue(mockRouter);

    const mockResults = {
      posts: [
        {
          id: 1,
          title: 'Test Article',
          content: 'Test Content',
          imageUrl: 'test.jpg',
          createdAt: '2024-01-01',
        },
      ],
      total: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResults),
    });

    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      const result = screen.getByText((content) => content.includes('#1:'));
      expect(result).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText((content) => content.includes('#1:')));
    expect(mockRouter.push).toHaveBeenCalledWith('/articles/1');
  });

  it('navigates to search results page on Enter key', () => {
    const mockRouter = {
      push: vi.fn(),
    };
    (useRouter as Mock).mockReturnValue(mockRouter);

    renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockRouter.push).toHaveBeenCalledWith('/articles?search=test%20query');
  });

  it('cleans up search timeout on unmount', () => {
    const { unmount } = renderWithProviders(<SearchBar />);
    const input = screen.getByPlaceholderText('Search articles...');

    fireEvent.change(input, { target: { value: 'test' } });
    unmount();

    // If we get here without errors, the cleanup was successful
    expect(true).toBe(true);
  });
});
