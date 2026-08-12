// 申请列表
import { getApplyList, withdrawApply } from '../store.js'
import { mockUsers } from '../mock.js'
import { genEl, formatDateShort } from '../utils.js'
import type { PageType } from '../types.js'
import {
  getApplicationSummary,
  getApplicationTypeLabel,
  getStatusLabel
} from '../application.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderList(root: HTMLElement, onChangePage: PageCb) {
  root.append(genEl('h2', {}, '申请列表'))
  const list = getApplyList()
  if (list.length === 0) {
    root.append(genEl('p', {}, '暂无申请记录'))
    return
  }
  const table = genEl('table', { style: 'border-collapse:collapse;width:100%;max-width:100%' })
  table.innerHTML = `
  <thead>
    <tr>
      <th style="border:1px solid #aaa;padding:6px">申请人</th>
      <th style="border:1px solid #aaa;padding:6px">类型</th>
      <th style="border:1px solid #aaa;padding:6px">摘要</th>
      <th style="border:1px solid #aaa;padding:6px">状态</th>
      <th style="border:1px solid #aaa;padding:6px">创建时间</th>
      <th style="border:1px solid #aaa;padding:6px">操作</th>
    </tr>
  </thead>
  <tbody></tbody>
  `
  const tbody = table.querySelector('tbody')!
  list.forEach(item => {
    const user = mockUsers.find(u => u.id === item.applicantId)
    const tr = genEl('tr')
    tr.innerHTML = `
      <td style="border:1px solid #aaa;padding:6px">${user?.name}</td>
      <td style="border:1px solid #aaa;padding:6px">${getApplicationTypeLabel(item.applicationType)}</td>
      <td style="border:1px solid #aaa;padding:6px">${getApplicationSummary(item)}</td>
      <td style="border:1px solid #aaa;padding:6px">${getStatusLabel(item.status)}</td>
      <td style="border:1px solid #aaa;padding:6px">${formatDateShort(item.createTime)}</td>
    `
    const tdOp = genEl('td', { style: 'border:1px solid #aaa;padding:6px' })
    const btn = genEl('button', {}, '查看详情')
    btn.onclick = () => onChangePage('detail', { id: item.id })
    tdOp.appendChild(btn)
    if (item.status === 'pending') {
      const withdrawBtn = genEl('button', { style: 'margin-left:8px' }, '撤回')
      withdrawBtn.onclick = () => {
        if (confirm('确认撤回该申请？') && withdrawApply(item.id)) {
          onChangePage('list')
        }
      }
      tdOp.appendChild(withdrawBtn)
    }
    tr.appendChild(tdOp)
    tbody.appendChild(tr)
  })
  root.appendChild(table)
}
