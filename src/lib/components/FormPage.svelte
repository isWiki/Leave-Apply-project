<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { currentUser, mockUsers } from '../../mock';
  import type { PageType, FormValue } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();

  export let prefill: FormValue = {
    applicantId: currentUser.id,
    overtimeDate: '',
    startTime: '',
    endTime: '',
    reason: ''
  };

  let form: FormValue = { ...prefill };

  $: if (prefill && prefill.applicantId) {
    form = { ...prefill };
  }

  function timeToMinutes(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  function preview() {
    if (!form.overtimeDate || !form.startTime || !form.endTime || !form.reason.trim()) {
      alert('请补全全部必填信息');
      return;
    }
    if (timeToMinutes(form.startTime) >= timeToMinutes(form.endTime)) {
      alert('开始时间必须早于结束时间');
      return;
    }
    dispatch('navigate', {
      page: 'preview',
      payload: { formData: JSON.stringify(form) }
    });
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">发起加班申请</h2>
    <p class="mt-2 text-sm text-slate-500">填写加班信息并预览后提交，SvelteKit 让表单逻辑更清晰。</p>
  </div>

  <div class="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:grid-cols-2">
    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 申请人</span>
      <select bind:value={form.applicantId} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
        {#each mockUsers as user}
          <option value={user.id}>{user.name}</option>
        {/each}
      </select>
    </label>

    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 加班日期</span>
      <input type="date" bind:value={form.overtimeDate} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
    </label>

    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 开始时间</span>
      <input type="time" bind:value={form.startTime} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
    </label>

    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 结束时间</span>
      <input type="time" bind:value={form.endTime} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
    </label>

    <div class="sm:col-span-2 space-y-2 text-sm text-slate-700">
      <div class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 加班事由</div>
      <textarea bind:value={form.reason} rows="5" class="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"></textarea>
    </div>
  </div>

  <div class="flex justify-end">
    <button type="button" class="btn-primary" on:click={preview}>预览申请信息</button>
  </div>
