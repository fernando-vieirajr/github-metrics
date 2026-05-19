import { describe, it, expect } from 'vitest'
import { calculateScore } from '../../../server/utils/score'

describe('calculateScore', () => {
  it('zero input returns all zeros', () => {
    const result = calculateScore(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false, false, false)
    expect(result.total).toBe(0)
    expect(result.activity).toBe(0)
    expect(result.impact).toBe(0)
    expect(result.diversity).toBe(0)
    expect(result.engagement).toBe(0)
  })

  it('total equals sum of parts', () => {
    const result = calculateScore(200, 30, 100, 50, 20, 10, 10, 8, 5, 4, true, true, true, true)
    expect(result.total).toBe(result.activity + result.impact + result.diversity + result.engagement)
  })

  it('never exceeds 1000', () => {
    const result = calculateScore(99999, 9999, 9999, 99999, 99999, 99999, 9999, 9999, 9999, 9999, true, true, true, true)
    expect(result.total).toBeLessThanOrEqual(1000)
  })

  it('activity max is 350', () => {
    const result = calculateScore(99999, 9999, 9999, 0, 0, 0, 0, 0, 0, 0, false, false, false, false)
    expect(result.activity).toBeLessThanOrEqual(350)
    expect(result.activity).toBeGreaterThan(0)
  })

  it('impact max is 350', () => {
    const result = calculateScore(0, 0, 0, 99999, 99999, 99999, 0, 0, 0, 0, false, false, false, false)
    expect(result.impact).toBeLessThanOrEqual(350)
    expect(result.impact).toBeGreaterThan(0)
  })

  it('diversity max is 200', () => {
    const result = calculateScore(0, 0, 0, 0, 0, 0, 0, 0, 0, 9999, true, true, true, true)
    expect(result.diversity).toBeLessThanOrEqual(200)
    expect(result.diversity).toBeGreaterThan(0)
  })

  it('engagement max is 100', () => {
    const result = calculateScore(0, 0, 0, 0, 0, 0, 9999, 9999, 9999, 0, false, false, false, false)
    expect(result.engagement).toBeLessThanOrEqual(100)
    expect(result.engagement).toBeGreaterThan(0)
  })

  it('partial profile with only commits gets activity > 0 but impact = 0', () => {
    const result = calculateScore(300, 0, 0, 0, 0, 0, 0, 0, 0, 0, false, false, false, false)
    expect(result.activity).toBeGreaterThan(0)
    expect(result.impact).toBe(0)
  })
})
