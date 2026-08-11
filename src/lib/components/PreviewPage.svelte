<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { mockUsers } from '../../mock';
  import { createApply } from '../../store';
  import type { PageType, FormValue } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  export let formData = '';

  const form: FormValue = formData ? JSON.parse(formData) : {
    applicantId: '',
    overtimeDate: '',
    startTime: '',
    endTime: '',
    reason: ''
  };

  const user = mockUsers.find((item) => item.id === form.applicantId);

  function back() {
    dispatch('navigate', { page: 'form', payload: { prefill: formData } });
  }

  function submit() {
    createApply({
      applicantId: form.applicantId,
      overtimeDate: form.overtimeDate,
      startTime: form.startTime,
      endTime: form.endTime,
      reason: form.reason,
      status: 'pending'
    });
    alert('提交成功！');
    dispatch('navigate', { page: 'list' });
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">预览加班申请</h2>
    <p class="mt-2 text-sm text-slate-500">确认信息无误后提交申请，Tailwind 让样式更轻量。</p>
  </div>

  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <p class="text-sm text-slate-500">申请人</p>
        <p class="text-base font-medium text-slate-900">{user?.name || '未知用户'}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-500">加班日期</p>
        <p class="text-base font-medium text-slate-900">{form.overtimeDate}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-500">时段</p>
        <p class="text-base font-medium text-slate-900">{form.startTime} - {form.endTime}</p>
      </div>
      <div class="space-y-2">
        <p class="text-sm text-slate-500">事由</p>
        <p class="text-base font-medium text-slate-900">{form.reason}</p>
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
    <button type="button" class="btn-secondary w-full sm:w-auto" on:click={back}>返回修改表单</button>
    <button type="button" class="btn-primary w-full sm:w-auto" on:click={submit}>确认提交申请</button>
  </div>
</section>
