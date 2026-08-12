import { beforeEach, describe, expect, it } from 'vitest'
import {
  createEmptyForm,
  getApplicationSummary,
  getApplicationTypeLabel,
  validateForm
} from './application'

describe('application helpers', () => {
  it('creates empty forms by type', () => {
    expect(createEmptyForm('u1', 'travel').applicationType).toBe('travel')
    expect(createEmptyForm('u1', 'purchase').applicationType).toBe('purchase')
    expect(createEmptyForm('u1', 'reimbursement').applicationType).toBe('reimbursement')
    expect(createEmptyForm('u1').applicationType).toBe('overtime')
  })

  it('validates overtime time range', () => {
    expect(
      validateForm({
        applicationType: 'overtime',
        applicantId: 'u1',
        overtimeDate: '2026-08-10',
        startTime: '20:00',
        endTime: '19:00',
        reason: '测试'
      })
    ).toBe('开始时间必须早于结束时间')
  })

  it('builds labels and summaries', () => {
    expect(getApplicationTypeLabel('purchase')).toBe('采购')
    expect(
      getApplicationSummary({
        applicationType: 'purchase',
        applicantId: 'u1',
        item: '显示器',
        vendor: 'A',
        amount: '1200',
        justification: '办公'
      })
    ).toBe('显示器 ¥1200')
  })
})
