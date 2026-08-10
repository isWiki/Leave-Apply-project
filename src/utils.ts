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

export function genEl<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: Record<string, string>, inner?: string): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  }
  if (inner !== undefined) el.innerHTML = inner
  return el
}