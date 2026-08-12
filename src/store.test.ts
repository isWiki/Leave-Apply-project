import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApply, getApplyById, getApplyList, getStat, updateApplyStatus, withdrawApply } from './store'

beforeEach(() => {
  localStorage.clear()
})

describe('store', () => {
  it('creates and persists a travel application', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'travel',
      destination: '上海',
      departureDate: '2026-08-20',
      returnDate: '2026-08-23',
      purpose: '客户拜访',
      estimatedAmount: '3200',
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
      applicationType: 'purchase',
      item: '笔记本电脑',
      vendor: '供应商A',
      amount: '8200',
      justification: '开发人员设备更新',
      status: 'pending'
    })

    const changed = updateApplyStatus(item.id, 'approved')
    expect(changed).toBe(true)

    const updated = getApplyById(item.id)
    expect(updated?.status).toBe('approved')

    const stat = getStat()
    expect(stat).toEqual({ total: 1, pending: 0, approved: 1, rejected: 0 })
  })

  it('withdraws pending application and rejects non-pending', () => {
    let now = 1000
    vi.spyOn(Date, 'now').mockImplementation(() => {
      now += 1
      return now
    })

    const pending = createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-10',
      startTime: '18:00',
      endTime: '20:00',
      reason: '项目上线',
      status: 'pending'
    })
    const approved = createApply({
      applicantId: 'u1',
      applicationType: 'overtime',
      overtimeDate: '2026-08-11',
      startTime: '18:00',
      endTime: '20:00',
      reason: '其他',
      status: 'approved'
    })

    expect(withdrawApply(pending.id)).toBe(true)
    expect(getApplyList()).toHaveLength(1)
    expect(getApplyById(pending.id)).toBeUndefined()
    expect(withdrawApply(approved.id)).toBe(false)
    expect(getApplyList()).toHaveLength(1)
  })
})
