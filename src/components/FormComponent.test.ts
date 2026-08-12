import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderForm } from './FormComponent'
import { mockUsers } from '../mock'

describe('FormComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the form and preview button triggers navigation with form values', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)

    const onChangePage = vi.fn()
    renderForm(root, onChangePage)

    const select = document.getElementById('selUser') as HTMLSelectElement
    const dateInput = document.getElementById('overtimeDate') as HTMLInputElement
    const startInput = document.getElementById('startTime') as HTMLInputElement
    const endInput = document.getElementById('endTime') as HTMLInputElement
    const reasonInput = document.getElementById('reason') as HTMLTextAreaElement
    const previewButton = Array.from(root.querySelectorAll('button')).find(btn => btn.textContent === '预览申请信息')!

    expect(select).toBeTruthy()
    expect(dateInput).toBeTruthy()
    expect(reasonInput).toBeTruthy()

    dateInput.value = '2026-08-10'
    startInput.value = '19:00'
    endInput.value = '21:00'
    reasonInput.value = '测试单元测试'
    select.value = mockUsers[2].id

    previewButton.click()

    expect(onChangePage).toHaveBeenCalledOnce()
    expect(onChangePage).toHaveBeenCalledWith('preview', expect.objectContaining({ formData: expect.any(String) }))
    const payload = (onChangePage.mock.calls[0]![1] as { formData: string }).formData
    const parsed = JSON.parse(payload)
    expect(parsed.applicantId).toBe(mockUsers[2].id)
    expect(parsed.applicationType).toBe('overtime')
    expect(parsed.overtimeDate).toBe('2026-08-10')
  })

  it('marks all form fields as required with a red asterisk', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)

    renderForm(root, vi.fn())

    const labels = Array.from(root.querySelectorAll('label'))
    const requiredLabels = labels.filter(label => label.querySelector('.required-mark'))

    expect(requiredLabels).toHaveLength(6)
    expect(document.getElementById('applicationType')?.hasAttribute('required')).toBe(true)
    expect(document.getElementById('selUser')?.hasAttribute('required')).toBe(true)
    expect(document.getElementById('overtimeDate')?.hasAttribute('required')).toBe(true)
    expect(document.getElementById('startTime')?.hasAttribute('required')).toBe(true)
    expect(document.getElementById('endTime')?.hasAttribute('required')).toBe(true)
    expect(document.getElementById('reason')?.hasAttribute('required')).toBe(true)
  })
})
