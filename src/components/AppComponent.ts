// 简易路由
import type { PageType } from '../types.js'
import { renderForm } from './FormComponent.js'
import { renderPreview } from './PreviewComponent.js'
import { renderList } from './ListComponent.js'
import { renderDetail } from './DetailComponent.js'
import { renderStat } from './StatComponent.js'

type OnChangePage = (page: PageType, payload?: Record<string, string>) => void

let container: HTMLElement
let onChangePage: OnChangePage

export function initApp(root: HTMLElement, cb: OnChangePage) {
  container = root
  onChangePage = cb
}

export function renderPage(page: PageType, payload?: Record<string, string>) {
  container.innerHTML = ''
  const nav = document.createElement('div')
  nav.style.marginBottom = '16px'
  nav.style.display = 'flex'
  nav.style.gap = '8px'

  const btns = [
    { label: '发起申请', page: 'form' as PageType },
    { label: '申请列表', page: 'list' as PageType },
    { label: '统计报表', page: 'stat' as PageType }
  ]
  btns.forEach(b => {
    const btn = document.createElement('button')
    btn.textContent = b.label
    btn.onclick = () => onChangePage(b.page)
    nav.appendChild(btn)
  })
  container.appendChild(nav)

  switch (page) {
    case 'form': renderForm(container, onChangePage); break
    case 'preview': renderPreview(container, onChangePage, payload); break
    case 'list': renderList(container, onChangePage); break
    case 'detail': renderDetail(container, onChangePage, payload); break
    case 'stat': renderStat(container); break
  }
}