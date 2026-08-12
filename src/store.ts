// 状态，localStorage 持久化
import { getApprovalChain, normalizeApplication } from './approval.js'
import type { Application, ApplicationStatus, FormValue } from './types.js'

const STORAGE_KEY = 'approval_workflow_list'

function canUseStorage() {
  return typeof localStorage !== 'undefined'
}

function normalizeList(list: Application[]): Application[] {
  return list.map(normalizeApplication)
}

export function getApplyList(): Application[] {
  if (!canUseStorage()) return []
  const str = localStorage.getItem(STORAGE_KEY)
  if (!str) return []
  try {
    return normalizeList(JSON.parse(str))
  } catch {
    return []
  }
}

export function saveApplyList(list: Application[]) {
  if (!canUseStorage()) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeList(list)))
}

export function createApply(data: FormValue & { status: ApplicationStatus }): Application {
  const list = getApplyList()
  const newItem = normalizeApplication({
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createTime: new Date().toISOString(),
    currentNodeIndex: 0
  } as Application)
  list.unshift(newItem)
  saveApplyList(list)
  return newItem
}

export function updateApplyStatus(id: string, status: ApplicationStatus): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false
  list[idx].status = status
  saveApplyList(list)
  return true
}

export function approveAtCurrentNode(id: string): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false

  const app = normalizeApplication(list[idx])
  if (app.status !== 'pending') return false

  const chain = getApprovalChain(app.applicationType)
  if (app.currentNodeIndex >= chain.length) return false

  if (app.currentNodeIndex === chain.length - 1) {
    app.status = 'approved'
  } else {
    app.currentNodeIndex += 1
  }

  list[idx] = app
  saveApplyList(list)
  return true
}

export function rejectToApplicant(id: string): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false

  const app = normalizeApplication(list[idx])
  if (app.status !== 'pending') return false

  app.status = 'rejected'
  list[idx] = app
  saveApplyList(list)
  return true
}

export function rejectToPreviousNode(id: string): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false

  const app = normalizeApplication(list[idx])
  if (app.status !== 'pending' || app.currentNodeIndex <= 0) return false

  app.currentNodeIndex -= 1
  list[idx] = app
  saveApplyList(list)
  return true
}

export function resubmitApply(id: string, data: FormValue): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false

  const app = normalizeApplication(list[idx])
  if (app.status !== 'rejected') return false

  const updated = normalizeApplication({
    ...data,
    id: app.id,
    createTime: app.createTime,
    status: 'pending',
    currentNodeIndex: app.currentNodeIndex
  } as Application)

  list[idx] = updated
  saveApplyList(list)
  return true
}

export function withdrawApply(id: string): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1 || list[idx].status !== 'pending') return false
  list.splice(idx, 1)
  saveApplyList(list)
  return true
}

export function getApplyById(id: string): Application | undefined {
  const item = getApplyList().find(i => i.id === id)
  return item ? normalizeApplication(item) : undefined
}

// 统计：按状态计数
export function getStat() {
  const list = getApplyList()
  const pending = list.filter(i => i.status === 'pending').length
  const approved = list.filter(i => i.status === 'approved').length
  const rejected = list.filter(i => i.status === 'rejected').length
  return { total: list.length, pending, approved, rejected }
}
