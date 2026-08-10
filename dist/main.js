import { initApp, renderPage } from './components/AppComponent.js';
import { renderForm } from './components/FormComponent.js';
let currentPage = 'form';
function onChangePage(page, payload) {
    currentPage = page;
    // 预览回跳表单回填
    if (page === 'form' && payload?.formData) {
        const prefill = JSON.parse(payload.formData);
        renderForm(document.getElementById('app'), onChangePage, prefill);
        return;
    }
    renderPage(page, payload);
}
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('app');
    initApp(root, onChangePage);
    renderPage(currentPage);
});
