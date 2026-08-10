import { initApp, renderPage } from './components/AppComponent.js'
import type { PageType } from './types.js'
import { renderForm } from './components/FormComponent.js'

let currentPage: PageType = 'form'

function onChangePage(page: PageType, payload?: Record<string, string>) {
  currentPage = page
  // 预览回跳表单回填
  if (page === 'form' && payload?.formData) {
    const prefill = JSON.parse(payload.formData)
    renderForm(document.getElementById('app')!, onChangePage, prefill)
    return
  }
  renderPage(page, payload)
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app') as HTMLElement
  initApp(root, onChangePage)
  renderPage(currentPage)
})