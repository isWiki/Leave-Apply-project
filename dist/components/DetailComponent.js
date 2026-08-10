// 申请详情 + 模拟审批
import { getApplyById, updateApplyStatus } from '../store.js';
import { mockUsers } from '../mock.js';
import { genEl, formatDate, formatDateShort } from '../utils.js';
export function renderDetail(root, onChangePage, payload) {
    if (!payload?.id)
        return;
    const item = getApplyById(payload.id);
    if (!item) {
        root.append(genEl('p', {}, '该申请不存在'));
        return;
    }
    root.append(genEl('h2', {}, '申请详情'));
    const user = mockUsers.find(u => u.id === item.applicantId);
    const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:16px;border-radius:6px;max-width:100%' });
    wrap.innerHTML = `
    <p><b>申请人：</b>${user?.name}</p>
    <p><b>加班日期：</b>${formatDate(item.overtimeDate)}</p>
    <p><b>时段：</b>${item.startTime} ~ ${item.endTime}</p>
    <p><b>事由：</b>${item.reason}</p>
    <p><b>当前状态：</b>${statusText(item.status)}</p>
    <p><b>提交时间：</b>${formatDateShort(item.createTime)}</p>
  `;
    root.appendChild(wrap);
    // 模拟审批操作，仅待审批可操作
    if (item.status === 'pending') {
        const btnWrap = genEl('div', { style: 'margin-top:12px;display:flex;gap:8px' });
        const btnPass = genEl('button', {}, '模拟审批通过');
        btnPass.onclick = () => {
            updateApplyStatus(item.id, 'pass');
            onChangePage('list');
        };
        const btnReject = genEl('button', {}, '模拟审批驳回');
        btnReject.onclick = () => {
            updateApplyStatus(item.id, 'reject');
            onChangePage('list');
        };
        btnWrap.appendChild(btnPass);
        btnWrap.appendChild(btnReject);
        root.appendChild(btnWrap);
    }
    const backBtn = genEl('button', { style: 'margin-top:12px' }, '返回列表');
    backBtn.onclick = () => onChangePage('list');
    root.appendChild(backBtn);
}
function statusText(s) {
    const map = { pending: '待审批', pass: '已通过', reject: '已驳回' };
    return map[s] || s;
}
