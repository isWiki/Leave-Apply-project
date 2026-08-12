import type { Application, ApplicationType, FormValue } from './types.js'
import { APPROVAL_CHAINS } from './types.js'

export function getApprovalChain(type: ApplicationType): string[] {
  return APPROVAL_CHAINS[type] ?? []
}

export function normalizeApplication(app: Application): Application {
  if (typeof app.currentNodeIndex === 'number') return app
  const chain = getApprovalChain(app.applicationType)
  const currentNodeIndex =
    app.status === 'approved' ? Math.max(chain.length - 1, 0) : 0
  return { ...app, currentNodeIndex }
}

export function applicationToFormValue(app: Application): FormValue {
  const normalized = normalizeApplication(app)
  const { id, status, createTime, currentNodeIndex, ...form } = normalized
  return form as FormValue
}

export function getApprovalStatusLabel(app: Application): string {
  const item = normalizeApplication(app)
  const chain = getApprovalChain(item.applicationType)

  if (item.status === 'approved') return '已通过'
  if (item.status === 'rejected') {
    const node = chain[item.currentNodeIndex]
    return node ? `已驳回（待修改，从${node}重新审批）` : '已驳回'
  }

  const node = chain[item.currentNodeIndex]
  return node ? `待${node}审批` : '待审批'
}

export type ApprovalStepState = 'done' | 'current' | 'pending' | 'rejected'

export function getApprovalStepState(
  app: Application,
  nodeIndex: number
): ApprovalStepState {
  const item = normalizeApplication(app)
  const chain = getApprovalChain(item.applicationType)

  if (item.status === 'approved') return 'done'
  if (nodeIndex < item.currentNodeIndex) return 'done'
  if (nodeIndex > item.currentNodeIndex) return 'pending'
  if (item.status === 'rejected') return 'rejected'
  return 'current'
}
