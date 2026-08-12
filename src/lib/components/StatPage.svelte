<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ECharts } from 'echarts';
  import { getStat } from '../../store';

  const stat = getStat();
  let chartEl: HTMLDivElement;
  let chart: ECharts | null = null;

  onMount(async () => {
    const echarts = await import('echarts');
    if (!chartEl) return;

    chart = echarts.init(chartEl);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { top: 'top' },
      series: [
        {
          name: '申请状态',
          type: 'pie',
          radius: ['35%', '70%'],
          data: [
            { value: stat.pending, name: '待审批' },
            { value: stat.approved, name: '已通过' },
            { value: stat.rejected, name: '已驳回' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  });

  onDestroy(() => {
    chart?.dispose();
  });
</script>

<section class="space-y-6">
  <div>
    <h2 class="text-2xl font-semibold text-slate-900">统计报表</h2>
    <p class="mt-2 text-sm text-slate-500">汇总全部申请类型的审批状态。</p>
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

  <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <p class="text-sm font-medium text-slate-700">申请状态分布</p>
    <div class="mt-4 h-80 w-full" bind:this={chartEl}></div>
  </div>
</section>
