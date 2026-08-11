// 人员
export interface User {
  id: string
  name: string
  deptId: string
}

// 部门
export interface Dept {
  id: string
  name: string
}

// 加班状态
export type OvertimeStatus = 'pending' | 'pass' | 'reject'

// 加班申请
export interface OvertimeApply {
  id: string
  applicantId: string
  overtimeDate: string
  startTime: string
  endTime: string
  reason: string
  status: OvertimeStatus
  createTime: string
}

// 页面类型
export type PageType = 'form' | 'preview' | 'list' | 'detail' | 'stat'

export const APP_PAGES: PageType[] = ['form', 'list', 'stat']