<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import type { ContribMonth } from '../interfaces/types'

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

<style scoped>
.contrib-chart {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.contrib-chart__title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 14px;
}
.contrib-chart__canvas-wrap {
  height: 120px;
}
.contrib-chart__empty {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}
</style>
