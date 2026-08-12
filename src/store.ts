// 状态，localStorage 持久化
import type { Application, ApplicationStatus, FormValue } from './types.js'

const STORAGE_KEY = 'approval_workflow_list'

function canUseStorage() {
  return typeof localStorage !== 'undefined'
}

export function getApplyList(): Application[] {
  if (!canUseStorage()) return []
  const str = localStorage.getItem(STORAGE_KEY)
  if (!str) return []
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

export function saveApplyList(list: Application[]) {
  if (!canUseStorage()) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function createApply(data: FormValue & { status: ApplicationStatus }): Application {
  const list = getApplyList()
  const newItem = {
    ...data,
    id: Date.now().toString(),
    createTime: new Date().toISOString()
  } as Application
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

export function withdrawApply(id: string): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1 || list[idx].status !== 'pending') return false
  list.splice(idx, 1)
  saveApplyList(list)
  return true
}

export function getApplyById(id: string): Application | undefined {
  return getApplyList().find(i => i.id === id)
}

// 统计：按状态计数
export function getStat() {
  const list = getApplyList()
  const pending = list.filter(i => i.status === 'pending').length
  const approved = list.filter(i => i.status === 'approved').length
  const rejected = list.filter(i => i.status === 'rejected').length
  return { total: list.length, pending, approved, rejected }
}
