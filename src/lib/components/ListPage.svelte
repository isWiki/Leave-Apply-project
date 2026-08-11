<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getApplyList } from '../../store';
  import { mockUsers } from '../../mock';
  import { formatDate, formatDateShort } from '../../utils';
  import type { PageType } from '../../types';

  const dispatch = createEventDispatcher<{ navigate: { page: PageType; payload?: Record<string, string> } }>();
  const list = getApplyList();

  function openDetail(id: string) {
    dispatch('navigate', { page: 'detail', payload: { id } });
  }

  function statusText(status: string) {
    return status === 'pending' ? '待审批' : status === 'pass' ? '已通过' : '已驳回';
  }
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">申请列表</h2>
    <p class="mt-2 text-sm text-slate-500">当前已提交的加班申请，点击“查看详情”可以进入审批页面。</p>
  </div>

  {#if list.length === 0}
    <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">暂无申请记录</div>
  {:else}
    <div class="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-6 py-4 font-medium text-slate-600">申请人</th>
            <th class="px-6 py-4 font-medium text-slate-600">加班日期</th>
            <th class="px-6 py-4 font-medium text-slate-600">状态</th>
            <th class="px-6 py-4 font-medium text-slate-600">创建时间</th>
            <th class="px-6 py-4 font-medium text-slate-600">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          {#each list as item}
            <tr>
              <td class="px-6 py-4 text-slate-700">{mockUsers.find((user) => user.id === item.applicantId)?.name}</td>
              <td class="px-6 py-4 text-slate-700">{formatDate(item.overtimeDate)}</td>
              <td class="px-6 py-4 text-slate-700">{statusText(item.status)}</td>
              <td class="px-6 py-4 text-slate-700">{formatDateShort(item.createTime)}</td>
              <td class="px-6 py-4">
                <button class="btn-secondary" on:click={() => openDetail(item.id)}>查看详情</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
