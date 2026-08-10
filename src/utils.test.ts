import { describe, expect, it } from 'vitest'
import { formatDate, genEl } from './utils'

describe('utils', () => {
  it('formats ISO date strings correctly', () => {
    expect(formatDate('2026-08-10T12:34:56.000Z')).toBe('2026/08/10')
  })

  it('creates elements with attributes and innerHTML', () => {
    const el = genEl('button', { type: 'button', id: 'test-btn' }, 'Click')
    expect(el.tagName).toBe('BUTTON')
    expect(el.id).toBe('test-btn')
    expect(el.innerHTML).toBe('Click')
  })
})
