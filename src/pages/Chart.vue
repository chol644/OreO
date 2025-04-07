<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <button @click="prevMonth" class="px-3 py-1 bg-gray-200 rounded">
      &lt;
    </button>

    <span class="mx-3 text-xl font-semibold">
      {{ currentYear }}년 {{ currentMonth }}월
    </span>

    <button @click="nextMonth" class="px-3 py-1 bg-gray-200 rounded">
      &gt;
    </button>
  </div>

  <div class="mt-3 text-center">
    <select v-model="selectedOption" class="border rounded p-2">
      <option value="expense">지출</option>
      <option value="income">수입</option>
      <option value="profit">순이익</option>
    </select>
  </div>

  <h2 class="mt-5 text-center font-bold text-xl">
    {{ currentYear }}년 {{ currentMonth }}월 {{ optionText }}
  </h2>

  <div v-if="isLoaded && hasData">
    <div class="mt-5 mb-3">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="mt-10 text-center">
      <p class="text-xl font-semibold">
        총 {{ optionText }}: {{ totalAmount.toLocaleString() }}원
      </p>
    </div>
  </div>

  <h2 v-else-if="isLoaded && !hasData" class="text-center text-xl mt-10">
    데이터가 없습니다.
  </h2>

  <h2 v-else class="text-center text-xl mt-10">
    데이터를 불러오는 중입니다...
  </h2>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const chartData = ref({ labels: [], datasets: [] });
const totalAmount = ref(0); //월별 총 금액
const hasData = ref(true);
const isLoaded = ref(false);
const selectedOption = ref('expense');

const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth() + 1);

//지출 카테고리
const expenseCategories = [
  '식비',
  '교통비',
  '마트/편의점',
  '패션/미용',
  '생활용품',
  '문화생활',
  '기타',
];

//수입 카테고리
const incomeCategories = ['월급', '부수입', '용돈', '기타'];

//옵션 문자열
const optionText = computed(() => {
  if (selectedOption.value === 'expense') return '지출';
  if (selectedOption.value === 'income') return '수입';
  return '순이익';
});

const chartOptions = ref({
  plugins: {
    tooltip: {
      //커서 올릴 시 뜨는 설명
      callbacks: {
        label: (tooltipItem) => {
          const dataset =
            tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce((acc, value) => acc + value, 0);
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const percentage = ((currentValue / total) * 100).toFixed(2);
          return `${tooltipItem.label}: ${percentage}%`;
        },
      },
    },
    datalabels: {
      // 차트 위에 보여지는 글자(퍼센트)
      formatter: (value, ctx) => {
        const dataset = ctx.chart.data.datasets[0];
        const total = dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        if (percentage === '0.0') return '';
        return `${ctx.chart.data.labels[ctx.dataIndex]}\n${percentage}%`;
      },
      color: '#fff',
      font: { weight: 'bold', size: 14 },
    },
    // 항목 이름 목록
    legend: { position: 'bottom' },
  },
});

const loadData = async () => {
  isLoaded.value = false;
  const response = await fetch('/db.json');
  const data = await response.json();
  totalAmount.value = 0;

  const transactions = data.users[0].transactions;
  const isSameMonth = (dateStr) => {
    const date = new Date(dateStr);
    return (
      date.getFullYear() === currentYear.value &&
      date.getMonth() + 1 === currentMonth.value
    );
  };

  if (selectedOption.value === 'expense') {
    const monthlyTotal = Object.fromEntries(
      expenseCategories.map((c) => [c, 0])
    );
    transactions.forEach((t) => {
      if (t.type === 'expense' && isSameMonth(t.date) && t.amount) {
        monthlyTotal[t.category.trim()] += t.amount;
        totalAmount.value += t.amount;
      }
    });
    chartData.value.labels = expenseCategories;
    chartData.value.datasets = [
      {
        label: `${currentYear.value}년 ${currentMonth.value}월 지출`,
        data: expenseCategories.map((cat) => monthlyTotal[cat]),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC926',
        ],
        hoverOffset: 8,
      },
    ];
  } else if (selectedOption.value === 'income') {
    const monthlyTotal = Object.fromEntries(
      incomeCategories.map((c) => [c, 0])
    );
    transactions.forEach((t) => {
      if (t.type === 'income' && isSameMonth(t.date) && t.amount) {
        monthlyTotal[t.category.trim()] += t.amount;
        totalAmount.value += t.amount;
      }
    });
    chartData.value.labels = incomeCategories;
    chartData.value.datasets = [
      {
        label: `${currentYear.value}년 ${currentMonth.value}월 수입`,
        data: incomeCategories.map((cat) => monthlyTotal[cat]),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverOffset: 8,
      },
    ];
  }

  hasData.value = totalAmount.value !== 0;
  isLoaded.value = true;
};

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else currentMonth.value--;
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else currentMonth.value++;
};

watch([currentMonth, currentYear, selectedOption], loadData);

onMounted(loadData);
</script>
