<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { mockUsers } from '../../mock';
  import { createApply, resubmitApply } from '../../store';
  import {
    getApplicationDetailFields,
    getApplicationTypeLabel,
    parseFormValue
  } from '../../application';
  import { currentUser } from '../../mock';
  import type { FormValue, PageType } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  export let formData = '';
  export let editId = '';

  const form: FormValue = parseFormValue(formData, currentUser.id);
  const user = mockUsers.find((item) => item.id === form.applicantId);
  const fields = getApplicationDetailFields(form);

  function back() {
    dispatch('navigate', { page: 'form', payload: { prefill: JSON.stringify(form) } });
  }

  function submit() {
    if (editId) {
      if (!resubmitApply(editId, form)) {
        alert('重新提交失败，请返回详情页重试。');
        return;
      }
      alert('重新提交成功！');
    } else {
      createApply({
        ...form,
        status: 'pending'
      });
      alert('提交成功！');
    }
    dispatch('navigate', { page: 'list' });
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">预览申请</h2>
    <p class="mt-2 text-sm text-slate-500">确认 {getApplicationTypeLabel(form.applicationType)} 申请信息无误后提交。</p>
  </div>

  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <p class="text-sm text-slate-500">申请类型</p>
        <p class="text-base font-medium text-slate-900">{getApplicationTypeLabel(form.applicationType)}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-500">申请人</p>
        <p class="text-base font-medium text-slate-900">{user?.name || '未知用户'}</p>
      </div>
      {#each fields as field}
        <div class="space-y-2 {field.label.includes('事由') || field.label.includes('说明') ? 'sm:col-span-2' : ''}">
          <p class="text-sm text-slate-500">{field.label}</p>
          <p class="text-base font-medium text-slate-900">{field.value}</p>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
    <button type="button" class="btn-secondary w-full sm:w-auto" on:click={back}>返回修改表单</button>
    <button type="button" class="btn-primary w-full sm:w-auto" on:click={submit}>
      {editId ? '确认重新提交' : '确认提交申请'}
    </button>
  </div>
</section>
