<script setup lang="ts">
import './ContribChart.css'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import type { ContribMonth } from '#core/interfaces/types'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{ data: ContribMonth[] | null; loading: boolean }>()

const chartData = computed(() => {
  if (!props.data) return null
  return {
    labels: props.data.map(d => {
      const [year, month] = d.month.split('-')
      return new Date(Number(year), Number(month) - 1).toLocaleString('en', { month: 'short' })
    }),
    datasets: [
      {
        label: 'Contributions',
        data: props.data.map(d => d.count),
        backgroundColor: '#4ade80',
        borderRadius: 3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
  },
}
</script>

<template>
  <div class="contrib-chart">
    <h2 class="contrib-chart__title">Contributions — Last 12 Months</h2>
    <template v-if="loading">
      <AppSkeleton height="120px" />
    </template>
    <div v-else-if="chartData" class="contrib-chart__canvas-wrap">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <p v-else class="contrib-chart__empty">No contribution data available</p>
  </div>
</template>
