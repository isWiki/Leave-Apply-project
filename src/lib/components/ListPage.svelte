<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getApplyList, withdrawApply } from '../../store';
  import { mockUsers } from '../../mock';
  import { formatDateShort } from '../../utils';
  import {
    getApplicationSummary,
    getApplicationTypeLabel,
    getApplicationStatusLabel
  } from '../../application';
  import type { PageType } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  let list = getApplyList();

  function openDetail(id: string) {
    dispatch('navigate', { page: 'detail', payload: { id } });
  }

  function withdraw(id: string) {
    if (!confirm('确认撤回该申请？')) return;
    if (withdrawApply(id)) {
      list = getApplyList();
    }
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">申请列表</h2>
    <p class="mt-2 text-sm text-slate-500">查看各类审批申请，点击“查看详情”进入审批页面。</p>
  </div>

  {#if list.length === 0}
    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">暂无申请记录</div>
  {:else}
    <div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-4 font-medium text-slate-600" style="width: 6rem">申请人</th>
            <th class="px-6 py-4 font-medium text-slate-600" style="width: 5rem">类型</th>
            <th class="px-6 py-4 font-medium text-slate-600" style="width: 14rem">摘要</th>
            <th class="px-6 py-4 font-medium text-slate-600">状态</th>
            <th class="px-6 py-4 font-medium text-slate-600">创建时间</th>
            <th class="px-6 py-4 font-medium text-slate-600">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          {#each list as item}
            <tr>
              <td class="px-6 py-4 text-slate-700">{mockUsers.find((user) => user.id === item.applicantId)?.name}</td>
              <td class="px-6 py-4 text-slate-700">{getApplicationTypeLabel(item.applicationType)}</td>
              <td class="px-6 py-4 text-slate-700">{getApplicationSummary(item)}</td>
              <td class="px-6 py-4 text-slate-700">{getApplicationStatusLabel(item)}</td>
              <td class="px-6 py-4 text-slate-700">{formatDateShort(item.createTime)}</td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-2">
                  <button class="btn-secondary" on:click={() => openDetail(item.id)}>查看详情</button>
                  {#if item.status === 'pending'}
                    <button class="btn-secondary" on:click={() => withdraw(item.id)}>撤回</button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
