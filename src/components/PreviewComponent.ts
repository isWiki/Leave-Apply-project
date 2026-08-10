// 预览，支持回跳表单修改
import type { PageType } from '../types.js'
import { mockUsers } from '../mock.js'
import { genEl, formatDate } from '../utils.js'
import { createApply } from '../store.js'
import { clearCachedForm } from './FormComponent.js'
import type { FormValue } from './FormComponent.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderPreview(root: HTMLElement, onChangePage: PageCb, payload?: Record<string, string>) {
  if (!payload?.formData) return
  const form: FormValue = JSON.parse(payload.formData)
  root.append(genEl('h2', {}, '预览加班申请'))

  const user = mockUsers.find(u => u.id === form.applicantId)
  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:16px;border-radius:6px;max-width:100%' })
  wrap.innerHTML = `
    <p><b>申请人：</b>${user?.name || ''}</p>
    <p><b>加班日期：</b>${formatDate(form.overtimeDate)}</p>
    <p><b>开始时间：</b>${form.startTime}</p>
    <p><b>结束时间：</b>${form.endTime}</p>
    <p><b>加班事由：</b>${form.reason}</p>
  `
  root.appendChild(wrap)

  const btnWrap = genEl('div', { style: 'margin-top:16px;display:flex;gap:10px' })
  // 返回修改：跳转到表单，回填数据
  const btnEdit = genEl('button', {}, '返回修改表单')
  btnEdit.onclick = () => {
    onChangePage('form', { formData: JSON.stringify(form) })
  }
  const btnSubmit = genEl('button', {}, '确认提交申请')
  btnSubmit.onclick = () => {
    createApply({
      applicantId: form.applicantId,
      overtimeDate: form.overtimeDate,
      startTime: form.startTime,
      endTime: form.endTime,
      reason: form.reason,
      status: 'pending'
    })
    // 清空表单缓存，避免下次进入表单显示旧数据
    clearCachedForm()
    alert('提交成功！')
    onChangePage('list')
  }
  btnWrap.appendChild(btnEdit)
  btnWrap.appendChild(btnSubmit)
  root.appendChild(btnWrap)
}