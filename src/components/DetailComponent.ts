// 申请详情 + 多级审批模拟
import {
  approveAtCurrentNode,
  getApplyById,
  rejectToApplicant,
  rejectToPreviousNode
} from '../store.js'
import { mockUsers } from '../mock.js'
import { genEl, formatDateShort } from '../utils.js'
import type { PageType } from '../types.js'
import {
  getApplicationDetailFields,
  getApplicationStatusLabel,
  getApplicationTypeLabel
} from '../application.js'
import {
  applicationToFormValue,
  getApprovalChain,
  getApprovalStepState
} from '../approval.js'

type PageCb = (page: PageType, payload?: Record<string, string>) => void

export function renderDetail(root: HTMLElement, onChangePage: PageCb, payload?: Record<string, string>) {
  if (!payload?.id) return
  const item = getApplyById(payload.id)
  if (!item) {
    root.append(genEl('p', {}, '该申请不存在'))
    return
  }

  root.append(genEl('h2', {}, '申请详情'))
  const chain = getApprovalChain(item.applicationType)
  const user = mockUsers.find(u => u.id === item.applicantId)

  const chainWrap = genEl('div', { style: 'margin-bottom:12px' })
  chainWrap.appendChild(genEl('p', {}, '审批链：'))
  const chainRow = genEl('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;align-items:center' })
  chain.forEach((node, index) => {
    const state = getApprovalStepState(item, index)
    const label =
      state === 'done'
        ? `${node} ✓`
        : state === 'current'
          ? `${node}（当前）`
          : state === 'rejected'
            ? `${node}（驳回）`
            : node
    chainRow.appendChild(genEl('span', { style: 'padding:4px 8px;border:1px solid #ccc;border-radius:4px' }, label))
    if (index < chain.length - 1) {
      chainRow.appendChild(genEl('span', {}, '→'))
    }
  })
  chainWrap.appendChild(chainRow)
  root.appendChild(chainWrap)

  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:16px;border-radius:6px;max-width:100%' })
  const fields = [
    { label: '申请类型', value: getApplicationTypeLabel(item.applicationType) },
    { label: '申请人', value: user?.name || '' },
    { label: '当前状态', value: getApplicationStatusLabel(item) },
    { label: '提交时间', value: formatDateShort(item.createTime) },
    ...getApplicationDetailFields(item)
  ]
  wrap.innerHTML = fields.map(field => `<p><b>${field.label}：</b>${field.value}</p>`).join('')
  root.appendChild(wrap)

  if (item.status === 'pending') {
    const currentNode = chain[item.currentNodeIndex] || ''
    const btnWrap = genEl('div', { style: 'margin-top:12px;display:flex;flex-wrap:wrap;gap:8px' })
    btnWrap.appendChild(genEl('p', {}, `当前节点：${currentNode}`))

    if (item.currentNodeIndex > 0) {
      const btnPrev = genEl('button', {}, `驳回至上一节点（${chain[item.currentNodeIndex - 1]}）`)
      btnPrev.onclick = () => {
        rejectToPreviousNode(item.id)
        onChangePage('detail', { id: item.id })
      }
      btnWrap.appendChild(btnPrev)
    }

    const btnReject = genEl('button', {}, '驳回至发起人')
    btnReject.onclick = () => {
      rejectToApplicant(item.id)
      onChangePage('detail', { id: item.id })
    }

    const btnPass = genEl(
      'button',
      {},
      item.currentNodeIndex === chain.length - 1
        ? '审批通过（结束）'
        : `审批通过 → ${chain[item.currentNodeIndex + 1]}`
    )
    btnPass.onclick = () => {
      approveAtCurrentNode(item.id)
      onChangePage('detail', { id: item.id })
    }

    btnWrap.appendChild(btnReject)
    btnWrap.appendChild(btnPass)
    root.appendChild(btnWrap)
  }

  if (item.status === 'rejected') {
    const resubmitWrap = genEl('div', { style: 'margin-top:12px' })
    const currentNode = chain[item.currentNodeIndex] || ''
    resubmitWrap.appendChild(
      genEl('p', {}, `已驳回，修改后将从「${currentNode}」节点重新审批。`)
    )
    const btnResubmit = genEl('button', {}, '修改并重新提交')
    btnResubmit.onclick = () => {
      const form = applicationToFormValue(item)
      onChangePage('form', { formData: JSON.stringify(form), editId: item.id })
    }
    resubmitWrap.appendChild(btnResubmit)
    root.appendChild(resubmitWrap)
  }

  const backBtn = genEl('button', { style: 'margin-top:12px' }, '返回列表')
  backBtn.onclick = () => onChangePage('list')
  root.appendChild(backBtn)
}
