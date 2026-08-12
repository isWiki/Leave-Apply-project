<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    approveAtCurrentNode,
    getApplyById,
    rejectToApplicant,
    rejectToPreviousNode
  } from '../../store';
  import { mockUsers } from '../../mock';
  import { formatDateShort } from '../../utils';
  import {
    getApplicationDetailFields,
    getApplicationStatusLabel,
    getApplicationTypeLabel
  } from '../../application';
  import {
    applicationToFormValue,
    getApprovalChain,
    getApprovalStepState
  } from '../../approval';
  import type { PageType } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  export let id = '';

  let item = getApplyById(id);

  function refresh() {
    item = getApplyById(id);
  }

  $: chain = item ? getApprovalChain(item.applicationType) : [];
  $: currentNodeName = item && chain[item.currentNodeIndex] ? chain[item.currentNodeIndex] : '';

  function approve() {
    if (!item) return;
    approveAtCurrentNode(item.id);
    refresh();
  }

  function rejectApplicant() {
    if (!item) return;
    rejectToApplicant(item.id);
    refresh();
  }

  function rejectPrevious() {
    if (!item) return;
    rejectToPreviousNode(item.id);
    refresh();
  }

  function editAndResubmit() {
    if (!item) return;
    const form = applicationToFormValue(item);
    dispatch('navigate', {
      page: 'form',
      payload: {
        prefill: JSON.stringify(form),
        editId: item.id
      }
    });
  }

  function goBack() {
    dispatch('navigate', { page: 'list' });
  }

  function stepClass(state: string) {
    if (state === 'done') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    if (state === 'current') return 'border-sky-300 bg-sky-50 text-sky-800 ring-2 ring-sky-200';
    if (state === 'rejected') return 'border-rose-300 bg-rose-50 text-rose-800 ring-2 ring-rose-200';
    return 'border-slate-200 bg-white text-slate-500';
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">申请详情</h2>
    <p class="mt-2 text-sm text-slate-500">查看审批链进度，点击按钮模拟各级审批通过或驳回。</p>
  </div>

  {#if !item}
    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">该申请不存在</div>
  {:else}
  {@const user = mockUsers.find((entry) => entry.id === item.applicantId)}
  {@const fields = getApplicationDetailFields(item)}
    <div class="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div>
        <p class="text-sm font-medium text-slate-700">审批链</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          {#each chain as node, index}
            {@const state = getApprovalStepState(item, index)}
            <div class="flex items-center gap-2">
              <div class="rounded-2xl border px-4 py-2 text-sm font-medium {stepClass(state)}">
                {node}
                {#if state === 'done'}
                  <span class="ml-1 text-emerald-600">✓</span>
                {:else if state === 'current'}
                  <span class="ml-1 text-sky-600">当前</span>
                {:else if state === 'rejected'}
                  <span class="ml-1 text-rose-600">驳回</span>
                {/if}
              </div>
              {#if index < chain.length - 1}
                <span class="text-slate-400">→</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

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
          <p class="text-base font-medium text-slate-900">{getApplicationStatusLabel(item)}</p>
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
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-sm text-slate-600">
            当前节点：<span class="font-semibold text-slate-900">{currentNodeName}</span>（模拟审批，无需切换角色）
          </p>
          <div class="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {#if item.currentNodeIndex > 0}
              <button type="button" class="btn-secondary w-full sm:w-auto" on:click={rejectPrevious}>
                驳回至上一节点（{chain[item.currentNodeIndex - 1]}）
              </button>
            {/if}
            <button type="button" class="btn-secondary w-full sm:w-auto" on:click={rejectApplicant}>
              驳回至发起人
            </button>
            <button type="button" class="btn-primary w-full sm:w-auto" on:click={approve}>
              {item.currentNodeIndex === chain.length - 1 ? '审批通过（结束）' : `审批通过 → ${chain[item.currentNodeIndex + 1]}`}
            </button>
          </div>
        </div>
      {:else if item.status === 'rejected'}
        <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p class="text-sm text-rose-800">
            申请已被驳回，发起人修改后将从 <span class="font-semibold">{currentNodeName}</span> 节点重新进入审批。
          </p>
          <div class="mt-3 flex justify-end">
            <button type="button" class="btn-primary" on:click={editAndResubmit}>修改并重新提交</button>
          </div>
        </div>
      {/if}

      <div class="text-right">
        <button type="button" class="btn-secondary" on:click={goBack}>返回列表</button>
      </div>
    </div>
  {/if}
</section>
