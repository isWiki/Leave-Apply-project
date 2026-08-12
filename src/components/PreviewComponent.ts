// 预览，支持回跳表单修改
import type { FormValue, PageType } from '../types.js'
import { mockUsers } from '../mock.js'
import { genEl } from '../utils.js'
import { createApply } from '../store.js'
import { clearCachedForm } from './FormComponent.js'
import {
  getApplicationDetailFields,
  getApplicationTypeLabel
} from '../application.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderPreview(root: HTMLElement, onChangePage: PageCb, payload?: Record<string, string>) {
  if (!payload?.formData) return
  const form: FormValue = JSON.parse(payload.formData)
  root.append(genEl('h2', {}, '预览申请'))

  const user = mockUsers.find(u => u.id === form.applicantId)
  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:16px;border-radius:6px;max-width:100%' })
  const fields = [
    { label: '申请类型', value: getApplicationTypeLabel(form.applicationType) },
    { label: '申请人', value: user?.name || '' },
    ...getApplicationDetailFields(form)
  ]
  wrap.innerHTML = fields.map(field => `<p><b>${field.label}：</b>${field.value}</p>`).join('')
  root.appendChild(wrap)

  const btnWrap = genEl('div', { style: 'margin-top:16px;display:flex;gap:10px' })
  const btnEdit = genEl('button', {}, '返回修改表单')
  btnEdit.onclick = () => {
    onChangePage('form', { formData: JSON.stringify(form) })
  }
  const btnSubmit = genEl('button', {}, '确认提交申请')
  btnSubmit.onclick = () => {
    createApply({
      ...form,
      status: 'pending'
    })
    clearCachedForm()
    alert('提交成功！')
    onChangePage('list')
  }
  btnWrap.appendChild(btnEdit)
  btnWrap.appendChild(btnSubmit)
  root.appendChild(btnWrap)
}
