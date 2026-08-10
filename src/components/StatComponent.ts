// 统计报表
import { getStat } from '../store.js'
import { genEl } from '../utils.js'

export function renderStat(root: HTMLElement) {
  root.append(genEl('h2', {}, '加班申请统计报表'))
  const stat = getStat()
  const wrap = genEl('div', { style: 'border:1px solid #ccc;padding:20px;border-radius:8px;max-width:100%' })
  wrap.innerHTML = `
    <p>总申请数：${stat.total}</p>
    <p>待审批：${stat.pending}</p>
    <p>已通过：${stat.pass}</p>
    <p>已驳回：${stat.reject}</p>
    <div id="stat-chart" style="width:100%;height:320px;margin-top:16px"></div>
  `
  root.appendChild(wrap)

  const chartDom = document.getElementById('stat-chart') as HTMLElement | null
  if (!chartDom) return

  const echarts = (window as Window & { echarts?: { init: (el: HTMLElement) => any; dispose: (instance: any) => void; setOption: (instance: any, option: any) => void } }).echarts
  if (!echarts) {
    chartDom.innerHTML = '<p style="color:#666">图表加载中，请稍后刷新页面。</p>'
    return
  }

  const chart = echarts.init(chartDom)
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: 'top' },
    series: [{
      name: '加班申请状态',
      type: 'pie',
      radius: ['35%', '70%'],
      data: [
        { value: stat.pending, name: '待审批' },
        { value: stat.pass, name: '已通过' },
        { value: stat.reject, name: '已驳回' }
      ],
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
  })
}