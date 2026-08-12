import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderList } from './ListComponent'
import { createApply, getApplyList } from '../store'

describe('ListComponent withdraw', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('shows withdraw button only for pending applications', () => {
    let now = 2000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 1
      return now
    })

    createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '待审批',
      status: 'pending'
    })
    createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-11',
      startTime: '18:00',
      endTime: '20:00',
      reason: '已通过',
      status: 'approved'
    })

    const root = document.createElement('div')
    document.body.appendChild(root)
    renderList(root, vi.fn())

    const withdrawButtons = Array.from(root.querySelectorAll('button')).filter(btn => btn.textContent === '撤回')
    expect(withdrawButtons).toHaveLength(1)
  })

  it('withdraws pending application after confirmation', () => {
    let now = 3000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 1
      return now
    })
    window.confirm = vi.fn(() => true) as typeof window.confirm

    const pending = createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '项目上线',
      status: 'pending'
    })

    const root = document.createElement('div')
    document.body.appendChild(root)
    const onChangePage = vi.fn()
    renderList(root, onChangePage)

    const withdrawButton = Array.from(root.querySelectorAll('button')).find(btn => btn.textContent === '撤回')!
    withdrawButton.click()

    expect(window.confirm).toHaveBeenCalledWith('确认撤回该申请？')
    expect(getApplyList()).toHaveLength(0)
    expect(onChangePage).toHaveBeenCalledWith('list')
  })

  it('does not withdraw when confirmation is cancelled', () => {
    let now = 4000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 1
      return now
    })
    window.confirm = vi.fn(() => false) as typeof window.confirm

    createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '项目上线',
      status: 'pending'
    })

    const root = document.createElement('div')
    document.body.appendChild(root)
    renderList(root, vi.fn())

    const withdrawButton = Array.from(root.querySelectorAll('button')).find(btn => btn.textContent === '撤回')!
    withdrawButton.click()

    expect(getApplyList()).toHaveLength(1)
  })
})
