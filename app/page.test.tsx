import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Home from './page';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Home Page', () => {
  it('renders without crashing', async () => {
    const searchParams = Promise.resolve({});
    const { container } = render(<Home searchParams={searchParams} />);
    expect(container).toBeTruthy();
  });
});
