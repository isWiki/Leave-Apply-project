// 加班申请表单
import { mockUsers, currentUser } from '../mock.js'
import type { PageType } from '../types.js'
import { genEl } from '../utils.js'

export type FormValue = {
  applicantId: string
  overtimeDate: string
  startTime: string
  endTime: string
  reason: string
}

let cacheForm: FormValue = {
  applicantId: currentUser.id,
  overtimeDate: '',
  startTime: '',
  endTime: '',
  reason: ''
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderForm(root: HTMLElement, onChangePage: PageCb, prefill?: FormValue) {
  if (prefill) cacheForm = { ...prefill }
  root.append(genEl('h2', {}, '发起加班申请'))

  const form = genEl('div', { style: 'display:flex;flex-direction:column;gap:12px;max-width:100%;' })

  // 申请人
  const labelUser = genEl('label', {}, '')
  labelUser.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  labelUser.appendChild(document.createTextNode('申请人：'))
  form.appendChild(labelUser)
  const selUser = genEl('select', { id: 'selUser', required: 'required' })
  mockUsers.forEach(u => {
    const opt = genEl('option', {}, u.name)
    opt.value = u.id
    if (u.id === cacheForm.applicantId) opt.selected = true
    selUser.appendChild(opt)
  })
  form.appendChild(selUser)

  // 加班日期
  const labelDate = genEl('label', {}, '')
  labelDate.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  labelDate.appendChild(document.createTextNode('加班日期：'))
  form.appendChild(labelDate)
  const inputDate = genEl('input', { type: 'date', id: 'overtimeDate', required: 'required' })
  inputDate.value = cacheForm.overtimeDate
  form.appendChild(inputDate)

  // 开始时间
  const labelStart = genEl('label', {}, '')
  labelStart.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  labelStart.appendChild(document.createTextNode('开始时间：'))
  form.appendChild(labelStart)
  const inputStart = genEl('input', { type: 'time', id: 'startTime', required: 'required' })
  inputStart.value = cacheForm.startTime
  form.appendChild(inputStart)

  // 结束时间
  const labelEnd = genEl('label', {}, '')
  labelEnd.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  labelEnd.appendChild(document.createTextNode('结束时间：'))
  form.appendChild(labelEnd)
  const inputEnd = genEl('input', { type: 'time', id: 'endTime', required: 'required' })
  inputEnd.value = cacheForm.endTime
  form.appendChild(inputEnd)

  // 加班事由
  const labelReason = genEl('label', {}, '')
  labelReason.appendChild(genEl('span', { class: 'required-mark' }, '* '))
  labelReason.appendChild(document.createTextNode('加班事由：'))
  form.appendChild(labelReason)
  const inputReason = genEl('textarea', { id: 'reason', rows: '4', required: 'required' })
  inputReason.value = cacheForm.reason
  form.appendChild(inputReason)

  const btnWrap = genEl('div', { style: 'margin-top:10px' })
  const btnPreview = genEl('button', {}, '预览申请信息')
  btnPreview.onclick = () => {
    const val: FormValue = {
      applicantId: (document.getElementById('selUser') as HTMLSelectElement).value,
      overtimeDate: (document.getElementById('overtimeDate') as HTMLInputElement).value,
      startTime: (document.getElementById('startTime') as HTMLInputElement).value,
      endTime: (document.getElementById('endTime') as HTMLInputElement).value,
      reason: (document.getElementById('reason') as HTMLTextAreaElement).value.trim()
    }
    if (!val.overtimeDate || !val.startTime || !val.endTime || !val.reason) {
      alert('请补全全部必填信息')
      return
    }
    // 开始时间必须早于结束时间
    if (timeToMinutes(val.startTime) >= timeToMinutes(val.endTime)) {
      alert('开始时间必须早于结束时间')
      return
    }
    cacheForm = val
    onChangePage('preview', { formData: JSON.stringify(val) })
  }
  btnWrap.appendChild(btnPreview)
  form.appendChild(btnWrap)
  root.appendChild(form)
}

export function getCachedForm(): FormValue {
  return { ...cacheForm }
}

export function clearCachedForm() {
  cacheForm = {
    applicantId: currentUser.id,
    overtimeDate: '',
    startTime: '',
    endTime: '',
    reason: ''
  }
}