// 申请列表
import { getApplyList, withdrawApply } from '../store.js'
import { mockUsers } from '../mock.js'
import { createTextCell, genEl, formatDateShort } from '../utils.js'
import type { PageType } from '../types.js'
import {
  getApplicationSummary,
  getApplicationTypeLabel,
  getApplicationStatusLabel
} from '../application.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

const CELL_STYLE = 'border:1px solid #aaa;padding:6px'

export function renderList(root: HTMLElement, onChangePage: PageCb) {
  root.append(genEl('h2', {}, '申请列表'))
  const list = getApplyList()
  if (list.length === 0) {
    root.append(genEl('p', {}, '暂无申请记录'))
    return
  }

  const table = genEl('table', { style: 'border-collapse:collapse;width:100%;max-width:100%' })
  const thead = document.createElement('thead')
  const headRow = document.createElement('tr')
  ;['申请人', '类型', '摘要', '状态', '创建时间', '操作'].forEach(title => {
    headRow.appendChild(createTextCell(title, CELL_STYLE))
  })
  thead.appendChild(headRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  list.forEach(item => {
    const user = mockUsers.find(u => u.id === item.applicantId)
    const tr = document.createElement('tr')
    tr.appendChild(createTextCell(user?.name ?? '', CELL_STYLE))
    tr.appendChild(createTextCell(getApplicationTypeLabel(item.applicationType), CELL_STYLE))
    tr.appendChild(createTextCell(getApplicationSummary(item), CELL_STYLE))
    tr.appendChild(createTextCell(getApplicationStatusLabel(item), CELL_STYLE))
    tr.appendChild(createTextCell(formatDateShort(item.createTime), CELL_STYLE))

    const tdOp = createTextCell('', CELL_STYLE)
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
  table.appendChild(tbody)
  root.appendChild(table)
}
