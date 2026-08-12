<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { currentUser, mockUsers } from '../../mock';
  import {
    createEmptyForm,
    parseFormValue,
    validateForm
  } from '../../application';
  import {
    APPLICATION_TYPES,
    type ApplicationType,
    type FormValue,
    type PageType
  } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();

  export let prefill: FormValue | string | undefined = undefined;
  export let editId = '';

  let form: FormValue = parseFormValue(prefill, currentUser.id);

  $: if (prefill !== undefined) {
    form = parseFormValue(prefill, currentUser.id);
  }

  function switchType(type: ApplicationType) {
    form = createEmptyForm(form.applicantId || currentUser.id, type);
  }

  function preview() {
    const error = validateForm(form);
    if (error) {
      alert(error);
      return;
    }
    dispatch('navigate', {
      page: 'preview',
      payload: {
        formData: JSON.stringify(form),
        editId
      }
    });
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">发起申请</h2>
    <p class="mt-2 text-sm text-slate-500">选择申请类型并填写对应信息，预览确认后提交审批。</p>
  </div>

  <div class="grid gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:grid-cols-2">
    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 申请类型</span>
      <select
        value={form.applicationType}
        class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        on:change={(e) => switchType(e.currentTarget.value as ApplicationType)}
      >
        {#each APPLICATION_TYPES as type}
          <option value={type.value}>{type.label}</option>
        {/each}
      </select>
    </label>

    <label class="space-y-2 text-sm text-slate-700">
      <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 申请人</span>
      <select bind:value={form.applicantId} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
        {#each mockUsers as user}
          <option value={user.id}>{user.name}</option>
        {/each}
      </select>
    </label>

    {#if form.applicationType === 'overtime'}
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
    {:else if form.applicationType === 'travel'}
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 目的地</span>
        <input type="text" bind:value={form.destination} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 预估费用</span>
        <input type="text" bind:value={form.estimatedAmount} placeholder="例如 3200" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 出发日期</span>
        <input type="date" bind:value={form.departureDate} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 返回日期</span>
        <input type="date" bind:value={form.returnDate} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <div class="sm:col-span-2 space-y-2 text-sm text-slate-700">
        <div class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 出差事由</div>
        <textarea bind:value={form.purpose} rows="5" class="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"></textarea>
      </div>
    {:else if form.applicationType === 'purchase'}
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 采购物品</span>
        <input type="text" bind:value={form.item} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 供应商</span>
        <input type="text" bind:value={form.vendor} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 采购金额</span>
        <input type="text" bind:value={form.amount} placeholder="例如 8200" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <div class="sm:col-span-2 space-y-2 text-sm text-slate-700">
        <div class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 采购说明</div>
        <textarea bind:value={form.justification} rows="5" class="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"></textarea>
      </div>
    {:else}
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 费用日期</span>
        <input type="date" bind:value={form.expenseDate} class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 费用类别</span>
        <input type="text" bind:value={form.category} placeholder="例如 交通费" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <label class="space-y-2 text-sm text-slate-700">
        <span class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 报销金额</span>
        <input type="text" bind:value={form.amount} placeholder="例如 500" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
      </label>
      <div class="sm:col-span-2 space-y-2 text-sm text-slate-700">
        <div class="flex items-center gap-1 font-medium text-slate-900"><span class="text-rose-500">*</span> 费用说明</div>
        <textarea bind:value={form.description} rows="5" class="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"></textarea>
      </div>
    {/if}
  </div>

  <div class="flex justify-end">
    <button type="button" class="btn-primary" on:click={preview}>预览申请信息</button>
  </div>
</section>
