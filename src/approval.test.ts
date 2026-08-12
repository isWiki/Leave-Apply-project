import { beforeEach, describe, expect, it } from 'vitest'
import { createApply } from './store'
import {
  getApprovalChain,
  getApprovalStatusLabel,
  getApprovalStepState
} from './approval'

beforeEach(() => {
  localStorage.clear()
})

describe('approval workflow helpers', () => {
  it('returns chains per application type', () => {
    const chain = ['部门主管', '财务', '总经理']
    expect(getApprovalChain('overtime')).toEqual(chain)
    expect(getApprovalChain('purchase')).toEqual(chain)
  })

  it('labels pending and rejected status with node name', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'purchase',
      item: '显示器',
      vendor: 'A',
      amount: '1200',
      justification: '办公',
      status: 'pending'
    })

    expect(getApprovalStatusLabel(item)).toBe('待部门主管审批')
  })
})

describe('approval step state', () => {
  it('marks current and done nodes during approval', () => {
    const item = createApply({
      applicantId: 'u1',
      applicationType: 'travel',
      destination: '杭州',
      departureDate: '2026-08-01',
      returnDate: '2026-08-03',
      purpose: '培训',
      estimatedAmount: '1500',
      status: 'pending'
    })

    expect(getApprovalStepState(item, 0)).toBe('current')
    expect(getApprovalStepState(item, 1)).toBe('pending')
  })
})
