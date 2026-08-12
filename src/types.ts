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

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: '待审批',
  approved: '已通过',
  rejected: '已驳回'
}

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

export type OvertimeFormValue = {
  applicationType: 'overtime'
  applicantId: string
  overtimeDate: string
  startTime: string
  endTime: string
  reason: string
}

export type TravelFormValue = {
  applicationType: 'travel'
  applicantId: string
  destination: string
  departureDate: string
  returnDate: string
  purpose: string
  estimatedAmount: string
}

export type PurchaseFormValue = {
  applicationType: 'purchase'
  applicantId: string
  item: string
  vendor: string
  amount: string
  justification: string
}

export type ReimbursementFormValue = {
  applicationType: 'reimbursement'
  applicantId: string
  expenseDate: string
  category: string
  amount: string
  description: string
}

export type FormValue =
  | OvertimeFormValue
  | TravelFormValue
  | PurchaseFormValue
  | ReimbursementFormValue

// 页面类型
export type PageType = 'form' | 'preview' | 'list' | 'detail' | 'stat'

export const APP_PAGES: PageType[] = ['form', 'list', 'stat']
export const NAV_PAGES: PageType[] = ['form', 'list', 'stat']
