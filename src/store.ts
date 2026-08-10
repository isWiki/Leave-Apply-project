// 状态，localStorage 持久化
import type { OvertimeApply, OvertimeStatus } from './types.js'

const STORAGE_KEY = 'overtime_apply_list'

export function getApplyList(): OvertimeApply[] {
  const str = localStorage.getItem(STORAGE_KEY)
  if (!str) return []
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

export function saveApplyList(list: OvertimeApply[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function createApply(data: Omit<OvertimeApply, 'id' | 'createTime'>): OvertimeApply {
  const list = getApplyList()
  const newItem: OvertimeApply = {
    ...data,
    id: Date.now().toString(),
    createTime: new Date().toISOString()
  }
  list.unshift(newItem)
  saveApplyList(list)
  return newItem
}

export function updateApplyStatus(id: string, status: OvertimeStatus): boolean {
  const list = getApplyList()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false
  list[idx].status = status
  saveApplyList(list)
  return true
}

export function getApplyById(id: string): OvertimeApply | undefined {
  return getApplyList().find(i => i.id === id)
}

// 统计：按状态计数
export function getStat() {
  const list = getApplyList()
  const pending = list.filter(i => i.status === 'pending').length
  const pass = list.filter(i => i.status === 'pass').length
  const reject = list.filter(i => i.status === 'reject').length
  return { total: list.length, pending, pass, reject }
}