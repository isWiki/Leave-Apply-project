<script lang="ts">
  import { getStat } from '../../store';

  const stat = getStat();
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">统计报表</h2>
    <p class="mt-2 text-sm text-slate-500">使用 Tailwind 卡片展示申请状态，避免手写大量 CSS。</p>
  </div>

  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm text-slate-500">总申请数</p>
      <p class="mt-4 text-3xl font-semibold text-slate-900">{stat.total}</p>
    </div>
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm text-slate-500">待审批</p>
      <p class="mt-4 text-3xl font-semibold text-slate-900">{stat.pending}</p>
    </div>
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm text-slate-500">已通过</p>
      <p class="mt-4 text-3xl font-semibold text-slate-900">{stat.approved}</p>
    </div>
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm text-slate-500">已驳回</p>
      <p class="mt-4 text-3xl font-semibold text-slate-900">{stat.rejected}</p>
    </div>
  </div>
</section>
