<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getApplyById, updateApplyStatus } from '../../store';
  import { mockUsers } from '../../mock';
  import { formatDateShort } from '../../utils';
  import {
    getApplicationDetailFields,
    getApplicationTypeLabel,
    getStatusLabel
  } from '../../application';
  import type { PageType } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  export let id = '';

  const item = getApplyById(id);
  const user = item ? mockUsers.find((entry) => entry.id === item.applicantId) : undefined;
  const fields = item ? getApplicationDetailFields(item) : [];

  function approve() {
    if (!item) return;
    updateApplyStatus(item.id, 'approved');
    dispatch('navigate', { page: 'list' });
  }

  function reject() {
    if (!item) return;
    updateApplyStatus(item.id, 'rejected');
    dispatch('navigate', { page: 'list' });
  }

  function goBack() {
    dispatch('navigate', { page: 'list' });
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">申请详情</h2>
    <p class="mt-2 text-sm text-slate-500">查看申请明细并模拟审批操作。</p>
  </div>

  {#if !item}
    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">该申请不存在</div>
  {:else}
    <div class="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-slate-500">申请类型</p>
          <p class="text-base font-medium text-slate-900">{getApplicationTypeLabel(item.applicationType)}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">申请人</p>
          <p class="text-base font-medium text-slate-900">{user?.name}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">当前状态</p>
          <p class="text-base font-medium text-slate-900">{getStatusLabel(item.status)}</p>
        </div>
        <div>
          <p class="text-sm text-slate-500">提交时间</p>
          <p class="text-base font-medium text-slate-900">{formatDateShort(item.createTime)}</p>
        </div>
        {#each fields as field}
          <div class="{field.label.includes('事由') || field.label.includes('说明') ? 'sm:col-span-2' : ''}">
            <p class="text-sm text-slate-500">{field.label}</p>
            {#if field.label.includes('事由') || field.label.includes('说明')}
              <p class="mt-1 rounded-3xl bg-white p-4 text-slate-800 shadow-sm">{field.value}</p>
            {:else}
              <p class="text-base font-medium text-slate-900">{field.value}</p>
            {/if}
          </div>
        {/each}
      </div>
      {#if item.status === 'pending'}
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" class="btn-secondary w-full sm:w-auto" on:click={reject}>模拟审批驳回</button>
          <button type="button" class="btn-primary w-full sm:w-auto" on:click={approve}>模拟审批通过</button>
        </div>
      {/if}
      <div class="text-right">
        <button type="button" class="btn-secondary" on:click={goBack}>返回列表</button>
      </div>
    </div>
  {/if}
</section>
