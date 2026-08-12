export function formatDate(iso: string): string {
  const d = new Date(iso)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

export type TextField = { label: string; value: string }

export function appendDetailFields(container: HTMLElement, fields: TextField[]) {
  fields.forEach(field => {
    const p = document.createElement('p')
    const label = document.createElement('b')
    label.textContent = `${field.label}：`
    p.appendChild(label)
    p.appendChild(document.createTextNode(field.value))
    container.appendChild(p)
  })
}

export function createTextCell(text: string, style?: string): HTMLTableCellElement {
  const td = document.createElement('td')
  if (style) td.setAttribute('style', style)
  td.textContent = text
  return td
}

export function genEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  text?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  }
  if (text !== undefined) el.textContent = text
  return el
}