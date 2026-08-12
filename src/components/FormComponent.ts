// 通用申请表单
import { mockUsers, currentUser } from '../mock.js'
import type { ApplicationType, FormValue, PageType } from '../types.js'
import { APPLICATION_TYPES } from '../types.js'
import { createEmptyForm, validateForm } from '../application.js'
import { genEl } from '../utils.js'

let cacheForm: FormValue = createEmptyForm(currentUser.id)
let cacheEditId = ''

type PageCb = (page: PageType, payload?: Record<string, string>) => void

function appendRequiredLabel(form: HTMLElement, text: string) {
  const label = genEl('label', {}, '')
  label.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  label.appendChild(document.createTextNode(text))
  form.appendChild(label)
  return label
}

function readCurrentForm(): FormValue {
  const applicantId = (document.getElementById('selUser') as HTMLSelectElement).value
  const applicationType = (document.getElementById('applicationType') as HTMLSelectElement).value as ApplicationType

  switch (applicationType) {
    case 'travel':
      return {
        applicationType: 'travel',
        applicantId,
        destination: (document.getElementById('destination') as HTMLInputElement).value.trim(),
        departureDate: (document.getElementById('departureDate') as HTMLInputElement).value,
        returnDate: (document.getElementById('returnDate') as HTMLInputElement).value,
        purpose: (document.getElementById('purpose') as HTMLTextAreaElement).value.trim(),
        estimatedAmount: (document.getElementById('estimatedAmount') as HTMLInputElement).value.trim()
      }
    case 'purchase':
      return {
        applicationType: 'purchase',
        applicantId,
        item: (document.getElementById('item') as HTMLInputElement).value.trim(),
        vendor: (document.getElementById('vendor') as HTMLInputElement).value.trim(),
        amount: (document.getElementById('amount') as HTMLInputElement).value.trim(),
        justification: (document.getElementById('justification') as HTMLTextAreaElement).value.trim()
      }
    case 'reimbursement':
      return {
        applicationType: 'reimbursement',
        applicantId,
        expenseDate: (document.getElementById('expenseDate') as HTMLInputElement).value,
        category: (document.getElementById('category') as HTMLInputElement).value.trim(),
        amount: (document.getElementById('amount') as HTMLInputElement).value.trim(),
        description: (document.getElementById('description') as HTMLTextAreaElement).value.trim()
      }
    default:
      return {
        applicationType: 'overtime',
        applicantId,
        overtimeDate: (document.getElementById('overtimeDate') as HTMLInputElement).value,
        startTime: (document.getElementById('startTime') as HTMLInputElement).value,
        endTime: (document.getElementById('endTime') as HTMLInputElement).value,
        reason: (document.getElementById('reason') as HTMLTextAreaElement).value.trim()
      }
  }
}

function renderTypeFields(container: HTMLElement, form: FormValue) {
  container.innerHTML = ''

  if (form.applicationType === 'overtime') {
    appendRequiredLabel(container, '加班日期：')
    const inputDate = genEl('input', { type: 'date', id: 'overtimeDate', required: 'required' })
    inputDate.value = form.overtimeDate
    container.appendChild(inputDate)

    appendRequiredLabel(container, '开始时间：')
    const inputStart = genEl('input', { type: 'time', id: 'startTime', required: 'required' })
    inputStart.value = form.startTime
    container.appendChild(inputStart)

    appendRequiredLabel(container, '结束时间：')
    const inputEnd = genEl('input', { type: 'time', id: 'endTime', required: 'required' })
    inputEnd.value = form.endTime
    container.appendChild(inputEnd)

    appendRequiredLabel(container, '加班事由：')
    const inputReason = genEl('textarea', { id: 'reason', rows: '4', required: 'required' })
    inputReason.value = form.reason
    container.appendChild(inputReason)
    return
  }

  if (form.applicationType === 'travel') {
    appendRequiredLabel(container, '目的地：')
    const destination = genEl('input', { type: 'text', id: 'destination', required: 'required' })
    destination.value = form.destination
    container.appendChild(destination)

    appendRequiredLabel(container, '出发日期：')
    const departureDate = genEl('input', { type: 'date', id: 'departureDate', required: 'required' })
    departureDate.value = form.departureDate
    container.appendChild(departureDate)

    appendRequiredLabel(container, '返回日期：')
    const returnDate = genEl('input', { type: 'date', id: 'returnDate', required: 'required' })
    returnDate.value = form.returnDate
    container.appendChild(returnDate)

    appendRequiredLabel(container, '预估费用：')
    const estimatedAmount = genEl('input', { type: 'text', id: 'estimatedAmount', required: 'required' })
    estimatedAmount.value = form.estimatedAmount
    container.appendChild(estimatedAmount)

    appendRequiredLabel(container, '出差事由：')
    const purpose = genEl('textarea', { id: 'purpose', rows: '4', required: 'required' })
    purpose.value = form.purpose
    container.appendChild(purpose)
    return
  }

  if (form.applicationType === 'purchase') {
    appendRequiredLabel(container, '采购物品：')
    const item = genEl('input', { type: 'text', id: 'item', required: 'required' })
    item.value = form.item
    container.appendChild(item)

    appendRequiredLabel(container, '供应商：')
    const vendor = genEl('input', { type: 'text', id: 'vendor', required: 'required' })
    vendor.value = form.vendor
    container.appendChild(vendor)

    appendRequiredLabel(container, '采购金额：')
    const amount = genEl('input', { type: 'text', id: 'amount', required: 'required' })
    amount.value = form.amount
    container.appendChild(amount)

    appendRequiredLabel(container, '采购说明：')
    const justification = genEl('textarea', { id: 'justification', rows: '4', required: 'required' })
    justification.value = form.justification
    container.appendChild(justification)
    return
  }

  appendRequiredLabel(container, '费用日期：')
  const expenseDate = genEl('input', { type: 'date', id: 'expenseDate', required: 'required' })
  expenseDate.value = form.expenseDate
  container.appendChild(expenseDate)

  appendRequiredLabel(container, '费用类别：')
  const category = genEl('input', { type: 'text', id: 'category', required: 'required' })
  category.value = form.category
  container.appendChild(category)

  appendRequiredLabel(container, '报销金额：')
  const amount = genEl('input', { type: 'text', id: 'amount', required: 'required' })
  amount.value = form.amount
  container.appendChild(amount)

  appendRequiredLabel(container, '费用说明：')
  const description = genEl('textarea', { id: 'description', rows: '4', required: 'required' })
  description.value = form.description
  container.appendChild(description)
}

export function renderForm(root: HTMLElement, onChangePage: PageCb, prefill?: FormValue, editId = '') {
  if (prefill) cacheForm = { ...prefill }
  cacheEditId = editId
  root.append(genEl('h2', {}, '发起申请'))

  const form = genEl('div', { style: 'display:flex;flex-direction:column;gap:12px;max-width:100%;' })

  appendRequiredLabel(form, '申请类型：')
  const selType = genEl('select', { id: 'applicationType', required: 'required' })
  APPLICATION_TYPES.forEach(type => {
    const opt = genEl('option', {}, type.label)
    opt.value = type.value
    if (type.value === cacheForm.applicationType) opt.selected = true
    selType.appendChild(opt)
  })
  form.appendChild(selType)

  appendRequiredLabel(form, '申请人：')
  const selUser = genEl('select', { id: 'selUser', required: 'required' })
  mockUsers.forEach(u => {
    const opt = genEl('option', {}, u.name)
    opt.value = u.id
    if (u.id === cacheForm.applicantId) opt.selected = true
    selUser.appendChild(opt)
  })
  form.appendChild(selUser)

  const typeFields = genEl('div', { id: 'typeFields', style: 'display:flex;flex-direction:column;gap:12px;' })
  renderTypeFields(typeFields, cacheForm)
  form.appendChild(typeFields)

  selType.onchange = () => {
    const applicantId = selUser.value
    cacheForm = createEmptyForm(applicantId, selType.value as ApplicationType)
    renderTypeFields(typeFields, cacheForm)
  }

  const btnWrap = genEl('div', { style: 'margin-top:10px' })
  const btnPreview = genEl('button', {}, '预览申请信息')
  btnPreview.onclick = () => {
    const val = readCurrentForm()
    const error = validateForm(val)
    if (error) {
      alert(error)
      return
    }
    cacheForm = val
    onChangePage('preview', { formData: JSON.stringify(val), editId: cacheEditId })
  }
  btnWrap.appendChild(btnPreview)
  form.appendChild(btnWrap)
  root.appendChild(form)
}

export function getCachedForm(): FormValue {
  return { ...cacheForm }
}

export function clearCachedForm() {
  cacheForm = createEmptyForm(currentUser.id)
  cacheEditId = ''
}

export type { FormValue }
