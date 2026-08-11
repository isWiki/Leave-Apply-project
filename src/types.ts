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

export type ApplicationType = 'overtime' | 'travel' | 'purchase' | 'reimbursement'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export const APPLICATION_TYPES: { value: ApplicationType; label: string }[] = [
  { value: 'overtime', label: '加班' },
  { value: 'travel', label: '差旅' },
  { value: 'purchase', label: '采购' },
  { value: 'reimbursement', label: '报销' }
]

export type BaseApplication = {
  id: string
  applicantId: string
  applicationType: ApplicationType
  status: ApplicationStatus
  createTime: string
}

export type OvertimeApplication = BaseApplication & {
  applicationType: 'overtime'
  overtimeDate: string
  startTime: string
  endTime: string
  reason: string
}

export type TravelApplication = BaseApplication & {
  applicationType: 'travel'
  destination: string
  departureDate: string
  returnDate: string
  purpose: string
  estimatedAmount: string
}

export type PurchaseApplication = BaseApplication & {
  applicationType: 'purchase'
  item: string
  vendor: string
  amount: string
  justification: string
}

export type ReimbursementApplication = BaseApplication & {
  applicationType: 'reimbursement'
  expenseDate: string
  category: string
  amount: string
  description: string
}

export type Application =
  | OvertimeApplication
  | TravelApplication
  | PurchaseApplication
  | ReimbursementApplication

export type FormValue =
  | OvertimeApplication
  | TravelApplication
  | PurchaseApplication
  | ReimbursementApplication

// 页面类型
export type PageType = 'form' | 'preview' | 'list' | 'detail' | 'stat'

export const APP_PAGES: PageType[] = ['form', 'list', 'stat']