export function formatDate(iso) {
    const d = new Date(iso);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
export function formatDateShort(iso) {
    const d = new Date(iso);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
export function genEl(tag, attrs, inner) {
    const el = document.createElement(tag);
    if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    }
    if (inner !== undefined)
        el.innerHTML = inner;
    return el;
}
