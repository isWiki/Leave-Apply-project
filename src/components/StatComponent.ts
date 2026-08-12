// 统计报表
import { getStat } from '../store.js'
import { genEl } from '../utils.js'

export function renderStat(root: HTMLElement) {
  root.append(genEl('h2', {}, '申请统计报表'))
  const stat = getStat()
  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:20px;border-radius:8px;max-width:100%' })
  wrap.appendChild(genEl('p', {}, `总申请数：${stat.total}`))
  wrap.appendChild(genEl('p', {}, `待审批：${stat.pending}`))
  wrap.appendChild(genEl('p', {}, `已通过：${stat.approved}`))
  wrap.appendChild(genEl('p', {}, `已驳回：${stat.rejected}`))
  const chartDom = genEl('div', {
    id: 'stat-chart',
    style: 'width:100%;height:320px;margin-top:16px'
  })
  wrap.appendChild(chartDom)
  root.appendChild(wrap)

  const chartEl = document.getElementById('stat-chart') as HTMLElement | null
  if (!chartEl) return

  const echarts = (window as Window & { echarts?: { init: (el: HTMLElement) => any } }).echarts
  if (!echarts) {
    chartEl.appendChild(genEl('p', { style: 'color:#666' }, '图表加载中，请稍后刷新页面。'))
    return
  }

  const chart = echarts.init(chartEl)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: 'top' },
    series: [{
      name: '申请状态',
      type: 'pie',
      radius: ['35%', '70%'],
      data: [
        { value: stat.pending, name: '待审批' },
        { value: stat.approved, name: '已通过' },
        { value: stat.rejected, name: '已驳回' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
  })
}
