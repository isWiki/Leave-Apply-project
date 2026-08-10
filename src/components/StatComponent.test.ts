import { describe, expect, it } from 'vitest'
import { renderStat } from './StatComponent'

describe('StatComponent', () => {
  it('renders chart container and summary values', () => {
    document.body.innerHTML = ''
    const root = document.createElement('div')
    document.body.appendChild(root)

    renderStat(root)

    expect(root.textContent).toContain('总申请数')
    expect(root.textContent).toContain('待审批')
    expect(root.textContent).toContain('已通过')
    expect(root.textContent).toContain('已驳回')
    expect(document.getElementById('stat-chart')).toBeTruthy()
  })
})
