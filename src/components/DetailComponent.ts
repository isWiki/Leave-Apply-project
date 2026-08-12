// 申请详情 + 模拟审批
import { getApplyById, updateApplyStatus } from '../store.js'
import { mockUsers } from '../mock.js'
import { genEl, formatDateShort } from '../utils.js'
import type { PageType } from '../types.js'
import {
  getApplicationDetailFields,
  getApplicationTypeLabel,
  getStatusLabel
} from '../application.js'

type PageCb = (page: PageType) => void

export function renderDetail(root: HTMLElement, onChangePage: PageCb, payload?: Record<string, string>) {
  if (!payload?.id) return
  const item = getApplyById(payload.id)
  if (!item) {
    root.append(genEl('p', {}, '该申请不存在'))
    return
  }
  root.append(genEl('h2', {}, '申请详情'))
  const user = mockUsers.find(u => u.id === item.applicantId)
  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:16px;border-radius:6px;max-width:100%' })
  const fields = [
    { label: '申请类型', value: getApplicationTypeLabel(item.applicationType) },
    { label: '申请人', value: user?.name || '' },
    { label: '当前状态', value: getStatusLabel(item.status) },
    { label: '提交时间', value: formatDateShort(item.createTime) },
    ...getApplicationDetailFields(item)
  ]
  wrap.innerHTML = fields.map(field => `<p><b>${field.label}：</b>${field.value}</p>`).join('')
  root.appendChild(wrap)

  if (item.status === 'pending') {
    const btnWrap = genEl('div', { style: 'margin-top:12px;display:flex;gap:8px' })
    const btnPass = genEl('button', {}, '模拟审批通过')
    btnPass.onclick = () => {
      updateApplyStatus(item.id, 'approved')
      onChangePage('list')
    }
    const btnReject = genEl('button', {}, '模拟审批驳回')
    btnReject.onclick = () => {
      updateApplyStatus(item.id, 'rejected')
      onChangePage('list')
    }
    btnWrap.appendChild(btnPass)
    btnWrap.appendChild(btnReject)
    root.appendChild(btnWrap)
  }

  const backBtn = genEl('button', { style: 'margin-top:12px' }, '返回列表')
  backBtn.onclick = () => onChangePage('list')
  root.appendChild(backBtn)
}
