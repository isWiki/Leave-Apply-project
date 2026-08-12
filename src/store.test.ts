import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  approveAtCurrentNode,
  createApply,
  getApplyById,
  getApplyList,
  getStat,
  rejectToApplicant,
  rejectToPreviousNode,
  resubmitApply,
  updateApplyStatus,
  withdrawApply
} from './store'

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
    expect(item.currentNodeIndex).toBe(0)
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

  it('walks through multi-level approval chain', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'purchase',
      item: '服务器',
      vendor: '供应商B',
      amount: '50000',
      justification: '扩容',
      status: 'pending'
    })

    expect(getApplyById(item.id)?.currentNodeIndex).toBe(0)
    expect(approveAtCurrentNode(item.id)).toBe(true)
    expect(getApplyById(item.id)?.currentNodeIndex).toBe(1)

    expect(approveAtCurrentNode(item.id)).toBe(true)
    expect(getApplyById(item.id)?.currentNodeIndex).toBe(2)

    expect(approveAtCurrentNode(item.id)).toBe(true)
    const approved = getApplyById(item.id)
    expect(approved?.status).toBe('approved')
    expect(approved?.currentNodeIndex).toBe(2)
  })

  it('rejects to applicant and resubmits from the same node', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'travel',
      destination: '北京',
      departureDate: '2026-09-01',
      returnDate: '2026-09-03',
      purpose: '会议',
      estimatedAmount: '2000',
      status: 'pending'
    })

    approveAtCurrentNode(item.id)
    expect(getApplyById(item.id)?.currentNodeIndex).toBe(1)

    rejectToApplicant(item.id)
    const rejected = getApplyById(item.id)
    expect(rejected?.status).toBe('rejected')
    expect(rejected?.currentNodeIndex).toBe(1)

    const ok = resubmitApply(item.id, {
      applicationType: 'travel',
      applicantId: 'u1',
      destination: '北京（修改）',
      departureDate: '2026-09-01',
      returnDate: '2026-09-04',
      purpose: '会议延期',
      estimatedAmount: '2500'
    })
    expect(ok).toBe(true)

    const pending = getApplyById(item.id)
    expect(pending?.status).toBe('pending')
    expect(pending?.currentNodeIndex).toBe(1)
    expect(pending?.destination).toBe('北京（修改）')
  })

  it('rejects to previous node', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'travel',
      destination: '深圳',
      departureDate: '2026-09-10',
      returnDate: '2026-09-12',
      purpose: '调研',
      estimatedAmount: '1800',
      status: 'pending'
    })

    approveAtCurrentNode(item.id)
    expect(rejectToPreviousNode(item.id)).toBe(true)

    const back = getApplyById(item.id)
    expect(back?.status).toBe('pending')
    expect(back?.currentNodeIndex).toBe(0)
  })
})
