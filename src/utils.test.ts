import { describe, expect, it } from 'vitest'
import { formatDate, genEl, appendDetailFields } from './utils'

describe('utils', () => {
  it('formats ISO date strings correctly', () => {
    expect(formatDate('2026-08-10T12:34:56.000Z')).toBe('2026/08/10')
  })

  it('creates elements with attributes and textContent', () => {
    const el = genEl('button', { type: 'button', id: 'test-btn' }, 'Click')
    expect(el.tagName).toBe('BUTTON')
    expect(el.id).toBe('test-btn')
    expect(el.textContent).toBe('Click')
  })

  it('does not interpret HTML in genEl text', () => {
    const el = genEl('div', {}, '<img src=x onerror="alert(1)">')
    expect(el.textContent).toBe('<img src=x onerror="alert(1)">')
    expect(el.querySelector('img')).toBeNull()
  })

  it('appendDetailFields escapes user content via text nodes', () => {
    const container = document.createElement('div')
    appendDetailFields(container, [
      { label: '说明', value: '<script>alert(1)</script>' }
    ])
    expect(container.textContent).toContain('<script>alert(1)</script>')
    expect(container.querySelector('script')).toBeNull()
  })
})
