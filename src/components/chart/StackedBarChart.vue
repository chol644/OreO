<template>
  <div v-if="chartData && chartData.labels && chartData.datasets">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Props
const props = defineProps({
  chartData: Object,
  chartOptions: Object,
});
</script>

<style scoped>
div {
  position: relative;
  width: 100%;
  min-height: 300px;
}
</style>
