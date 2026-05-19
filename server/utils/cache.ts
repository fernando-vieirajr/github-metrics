/// <reference types="nitropack" />

export async function getCached<T>(key: string): Promise<T | null> {
  const storage = useStorage('cache')
  const raw = await storage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw as string) as T
  }
  catch {
    return null
  }
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const storage = useStorage('cache')
  await storage.setItem(key, JSON.stringify(value), { ttl: ttlSeconds })
}
