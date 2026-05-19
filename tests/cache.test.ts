import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}

vi.stubGlobal('useStorage', () => mockStorage)

const { getCached, setCached } = await import('../../../server/utils/cache')

describe('getCached', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns null when key not found', async () => {
    mockStorage.getItem.mockResolvedValue(null)
    const result = await getCached('profile:nobody')
    expect(result).toBeNull()
  })

  it('returns parsed value when key exists', async () => {
    mockStorage.getItem.mockResolvedValue(JSON.stringify({ login: 'octocat' }))
    const result = await getCached<{ login: string }>('profile:octocat')
    expect(result?.login).toBe('octocat')
  })
})

describe('setCached', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls setItem with stringified value', async () => {
    await setCached('profile:octocat', { login: 'octocat' }, 3600)
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      'profile:octocat',
      JSON.stringify({ login: 'octocat' }),
      { ttl: 3600 },
    )
  })
})
