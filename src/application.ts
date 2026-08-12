import type {
  Application,
  ApplicationStatus,
  ApplicationType,
  FormValue,
  OvertimeFormValue,
  PurchaseFormValue,
  ReimbursementFormValue,
  TravelFormValue
} from './types.js'
import { APPLICATION_STATUS_LABELS, APPLICATION_TYPES } from './types.js'
import { formatDate } from './utils.js'
import { getApprovalStatusLabel } from './approval.js'

export function getApplicationTypeLabel(type: ApplicationType): string {
  return APPLICATION_TYPES.find(item => item.value === type)?.label ?? type
}

export function getStatusLabel(status: ApplicationStatus): string {
  return APPLICATION_STATUS_LABELS[status] ?? status
}

export function getApplicationStatusLabel(app: Application): string {
  return getApprovalStatusLabel(app)
}

export function createEmptyForm(applicantId: string, type: ApplicationType = 'overtime'): FormValue {
  switch (type) {
    case 'travel':
      return {
        applicationType: 'travel',
        applicantId,
        destination: '',
        departureDate: '',
        returnDate: '',
        purpose: '',
        estimatedAmount: ''
      }
    case 'purchase':
      return {
        applicationType: 'purchase',
        applicantId,
        item: '',
        vendor: '',
        amount: '',
        justification: ''
      }
    case 'reimbursement':
      return {
        applicationType: 'reimbursement',
        applicantId,
        expenseDate: '',
        category: '',
        amount: '',
        description: ''
      }
    default:
      return {
        applicationType: 'overtime',
        applicantId,
        overtimeDate: '',
        startTime: '',
        endTime: '',
        reason: ''
      }
  }
}

export function parseFormValue(raw: FormValue | string | undefined, applicantId: string): FormValue {
  if (!raw) return createEmptyForm(applicantId)
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as FormValue
    } catch {
      return createEmptyForm(applicantId)
    }
  }
  return raw
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function validateForm(form: FormValue): string | null {
  if (!form.applicantId) return '请选择申请人'

  switch (form.applicationType) {
    case 'overtime': {
      const overtime = form as OvertimeFormValue
      if (!overtime.overtimeDate || !overtime.startTime || !overtime.endTime || !overtime.reason.trim()) {
        return '请补全全部必填信息'
      }
      if (timeToMinutes(overtime.startTime) >= timeToMinutes(overtime.endTime)) {
        return '开始时间必须早于结束时间'
      }
      return null
    }
    case 'travel': {
      const travel = form as TravelFormValue
      if (
        !travel.destination.trim() ||
        !travel.departureDate ||
        !travel.returnDate ||
        !travel.purpose.trim() ||
        !travel.estimatedAmount.trim()
      ) {
        return '请补全全部必填信息'
      }
      if (travel.departureDate > travel.returnDate) {
        return '出发日期不能晚于返回日期'
      }
      return null
    }
    case 'purchase': {
      const purchase = form as PurchaseFormValue
      if (
        !purchase.item.trim() ||
        !purchase.vendor.trim() ||
        !purchase.amount.trim() ||
        !purchase.justification.trim()
      ) {
        return '请补全全部必填信息'
      }
      return null
    }
    case 'reimbursement': {
      const reimbursement = form as ReimbursementFormValue
      if (
        !reimbursement.expenseDate ||
        !reimbursement.category.trim() ||
        !reimbursement.amount.trim() ||
        !reimbursement.description.trim()
      ) {
        return '请补全全部必填信息'
      }
      return null
    }
  }
}

export function getApplicationSummary(data: Application | FormValue): string {
  switch (data.applicationType) {
    case 'overtime':
      return `${formatDate(data.overtimeDate)} ${data.startTime}-${data.endTime}`
    case 'travel':
      return `${data.destination} ${formatDate(data.departureDate)}~${formatDate(data.returnDate)}`
    case 'purchase':
      return `${data.item} ¥${data.amount}`
    case 'reimbursement':
      return `${data.category} ¥${data.amount}`
  }
}

export type DetailField = { label: string; value: string }

export function getApplicationDetailFields(data: Application | FormValue): DetailField[] {
  switch (data.applicationType) {
    case 'overtime':
      return [
        { label: '加班日期', value: formatDate(data.overtimeDate) },
        { label: '加班时段', value: `${data.startTime} - ${data.endTime}` },
        { label: '加班事由', value: data.reason }
      ]
    case 'travel':
      return [
        { label: '目的地', value: data.destination },
        { label: '出发日期', value: formatDate(data.departureDate) },
        { label: '返回日期', value: formatDate(data.returnDate) },
        { label: '预估费用', value: `¥${data.estimatedAmount}` },
        { label: '出差事由', value: data.purpose }
      ]
    case 'purchase':
      return [
        { label: '采购物品', value: data.item },
        { label: '供应商', value: data.vendor },
        { label: '采购金额', value: `¥${data.amount}` },
        { label: '采购说明', value: data.justification }
      ]
    case 'reimbursement':
      return [
        { label: '费用日期', value: formatDate(data.expenseDate) },
        { label: '费用类别', value: data.category },
        { label: '报销金额', value: `¥${data.amount}` },
        { label: '费用说明', value: data.description }
      ]
  }
}
