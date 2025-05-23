import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

describe('Posts API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns paginated posts', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts?page=1&limit=10')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('posts')
    expect(data).toHaveProperty('total')
    expect(Array.isArray(data.posts)).toBe(true)
  })

  it('handles invalid page parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts?page=invalid&limit=10')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('handles invalid limit parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/posts?page=1&limit=invalid')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
  })

  it('returns correct number of posts per page', async () => {
    const limit = 5
    const request = new NextRequest(`http://localhost:3000/api/posts?page=1&limit=${limit}`)
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.posts.length).toBeLessThanOrEqual(limit)
  })
}) 