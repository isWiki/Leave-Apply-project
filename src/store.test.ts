import { beforeEach, describe, expect, it } from 'vitest'
import { createApply, getApplyById, getApplyList, getStat, updateApplyStatus } from './store'
import type { OvertimeStatus } from './types'

beforeEach(() => {
  localStorage.clear()
})

describe('store', () => {
  it('creates and persists an overtime application', () => {
    const item = createApply({
      applicantId: 'u1',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '测试加班',
      status: 'pending'
    })

    expect(item.id).toBeTruthy()
    expect(item.createTime).toBeTruthy()
    expect(getApplyList()).toHaveLength(1)
    expect(getApplyById(item.id)).toEqual(item)
  })

  it('updates application status and returns stats', () => {
    const item = createApply({
      applicantId: 'u1',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '测试加班',
      status: 'pending'
    })

    const changed = updateApplyStatus(item.id, 'pass' as OvertimeStatus)
    expect(changed).toBe(true)

    const updated = getApplyById(item.id)
    expect(updated?.status).toBe('pass')

    const stat = getStat()
    expect(stat).toEqual({ total: 1, pending: 0, pass: 1, reject: 0 })
  })
})
