/**
 * src/__tests__/lib/api.test.ts
 * Tests for api.ts — verifies the instance is configured correctly.
 */
import api from '@/lib/api'

describe('api.ts — Axios instance', () => {
  it('is defined and is an object', () => {
    expect(api).toBeDefined()
    expect(typeof api).toBe('function')
  })

  it('has the correct baseURL configured', () => {
    const baseURL = (api.defaults as { baseURL?: string }).baseURL
    expect(baseURL).toContain('/api/v1')
  })

  it('has Content-Type header set to application/json', () => {
    const headers = api.defaults.headers as Record<string, unknown>
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('has interceptors attached', () => {
    expect(api.interceptors.request).toBeDefined()
    expect(api.interceptors.response).toBeDefined()
  })
})
