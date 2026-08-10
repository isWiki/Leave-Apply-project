// 申请列表
import { getApplyList } from '../store.js'
import { mockUsers } from '../mock.js'
import { genEl, formatDate, formatDateShort } from '../utils.js'
import type { PageType } from '../types.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderList(root: HTMLElement, onChangePage: PageCb) {
  root.append(genEl('h2', {}, '加班申请列表'))
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
      <th style="border:1px solid #aaa;padding:6px">加班日期</th>
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
      <td style="border:1px solid #aaa;padding:6px">${formatDate(item.overtimeDate)}</td>
      <td style="border:1px solid #aaa;padding:6px">${statusText(item.status)}</td>
        <td style="border:1px solid #aaa;padding:6px">${formatDateShort(item.createTime)}</td>
    `
    const tdOp = genEl('td', { style: 'border:1px solid #aaa;padding:6px' })
    const btn = genEl('button', {}, '查看详情')
    btn.onclick = () => onChangePage('detail', { id: item.id })
    tdOp.appendChild(btn)
    tr.appendChild(tdOp)
    tbody.appendChild(tr)
  })
  root.appendChild(table)
}

function statusText(s: string) {
  const map: Record<string, string> = { pending: '待审批', pass: '已通过', reject: '已驳回' }
  return map[s] || s
}