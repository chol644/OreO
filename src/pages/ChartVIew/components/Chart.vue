<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <button class="btn btn-sm btn-outline-secondary" @click="prevMonth">
      <i class="bi bi-chevron-left"></i>
    </button>

    <span class="mx-3 text-xl font-semibold">
      {{ currentYear }}년 {{ currentMonth }}월
    </span>

    <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>

  <div class="mt-3 text-center">
    <select v-model="selectedOption" class="border rounded p-2">
      <option value="expense">월별 지출</option>
      <option value="income">월별 수입</option>
      <option value="profit">최근 3개월 순이익</option>
      <option value="expense-3m">최근 3개월 지출</option>
      <option value="income-3m">최근 3개월 수입</option>
      <option value="expense-compare">전달 비교 지출</option>
    </select>
  </div>

  <h2 class="mt-3 text-center font-bold text-xl">
    <template v-if="selectedOption === 'profit'"> 최근 3개월 순이익 </template>
    <template v-else-if="selectedOption === 'expense-compare'">
      {{ currentYear }}년 {{ currentMonth - 1 }} vs {{ currentMonth }}월
      지출</template
    >
    <template v-else>
      {{ currentYear }}년 {{ currentMonth }}월 {{ optionText }}
    </template>
  </h2>
  <div
    class="mt-10 text-center"
    v-if="selectedOption !== 'expense-compare' && hasData"
  >
    <p class="fs-4 fw-semibold mt-3">
      <span style="color: #7c7c7c">총 {{ optionText }} : </span>
      <span
        :style="{
          color:
            selectedOption === 'expense' || selectedOption === 'expense-3m'
              ? '#f472b6'
              : selectedOption === 'income' || selectedOption === 'income-3m'
              ? '#10b981'
              : '#000',
        }"
      >
        {{ totalAmount.toLocaleString() }}원
      </span>
    </p>
  </div>
  <div v-if="isLoaded && hasData">
    <div class="mt-5 mb-3 chart-container">
      <component
        :is="chartComponent"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
    </div>
  </div>
  <div v-else-if="isLoaded && !hasData" class="text-center mt-3">
    <img
      src="@/assets/nodata.png"
      alt="데이터 없음"
      style="width: 400px; padding-top: 30px"
      class="mx-auto opacity-70 mt-0"
    />
    <p style="color: #999; font-size: 18px; margin-top: 10px">
      데이터가 없습니다
    </p>
  </div>

  <h2 v-else class="text-center text-xl mt-10">
    데이터를 불러오는 중입니다...
  </h2>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DoughnutChart from '@/pages/ChartVIew/components/DoughnutChart.vue';
import LineChart from '@/pages/ChartVIew/components/LineChart.vue';
import BarChart from '@/pages/ChartVIew/components/StackedBarChart.vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const chartData = ref({ labels: [], datasets: [] });
const totalAmount = ref(0);
const totalPrev = ref(0);
const totalCur = ref(0);
const hasData = ref(true);
const isLoaded = ref(false);
const selectedOption = ref('expense');

const currentDate = new Date();
const currentYear = ref(currentDate.getFullYear());
const currentMonth = ref(currentDate.getMonth() + 1);

const expenseCategories = [
  '식비',
  '교통비',
  '문화생활',
  '마트/편의점',
  '패션/미용',
  '생활용품',
  '공과금/주거',
  '통신비',
  '건강',
  '교육',
  '경조사/회비',
  '부모님',
];

const incomeCategories = ['월급', '부수입', '용돈', '상여', '금융소득'];

const optionText = computed(
  () =>
    ({
      expense: '지출',
      income: '수입',
      profit: '순이익',
      'expense-3m': '최근 3개월 지출',
      'income-3m': '최근 3개월 수입',
      'expense-compare': '전월 비교 지출',
    }[selectedOption.value])
);

const isSameMonth = (dateStr, year, month) => {
  const date = new Date(dateStr);
  return date.getFullYear() === year && date.getMonth() + 1 === month;
};

const getLast3Months = () => {
  const dates = [];
  let year = currentYear.value;
  let month = currentMonth.value;

  for (let i = 0; i < 3; i++) {
    dates.unshift({ year, month });
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
  }
  return dates;
};

const chartComponent = computed(() => {
  if (selectedOption.value === 'profit') return LineChart;
  if (selectedOption.value === 'expense-compare') return BarChart;
  return DoughnutChart;
});

const chartOptions = computed(() => {
  if (selectedOption.value === 'profit') return lineChartOptions;
  if (selectedOption.value === 'expense-compare') return stackedBarChartOptions;
  return donutChartOptions;
});

const stackedBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}원`,
      },
    },
    datalabels: {
      formatter: (value, ctx) => {
        const dataIndex = ctx.dataIndex;
        const total = ctx.chart.data.datasets
          .map((ds) => ds.data[dataIndex])
          .reduce((a, b) => a + b, 0);
        const percentage = total ? ((value / total) * 100).toFixed(0) : 0;
        return value === 0 ? '' : `${percentage}%`;
      },
      color: '#F5F5F5',
      font: { weight: 'normal', size: 10 },
      anchor: 'center',
      align: 'center',
    },
  },
  scales: {
    x: {
      stacked: true,
      title: { display: true, text: '월' },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      title: { display: true, text: '금액 (원)' },
    },
  },
};

const loadCategoryChartData = ({
  transactions,
  type,
  categories,
  isThreeMonth,
  label,
}) => {
  const totalByCategory = Object.fromEntries(categories.map((c) => [c, 0]));
  totalAmount.value = 0;

  const targetDates = isThreeMonth
    ? getLast3Months()
    : [{ year: currentYear.value, month: currentMonth.value }];

  targetDates.forEach(({ year, month }) => {
    transactions.forEach((t) => {
      if (t.type === type && isSameMonth(t.date, year, month) && t.amount) {
        const category = t.category.trim();
        if (totalByCategory.hasOwnProperty(category)) {
          totalByCategory[category] += t.amount;
          totalAmount.value += t.amount;
        }
      }
    });
  });

  chartData.value.labels = categories;
  chartData.value.datasets = [
    {
      label,
      data: categories.map((cat) => totalByCategory[cat]),
      backgroundColor:
        categories.length === 12
          ? [
              '#FF6384',
              '#36A2EB',
              '#4BC0C0',
              '#9966FF',
              '#FF3B30',
              '#FF9F40',
              '#8AC926',
              '#FF6B6B',
              '#6A4C93',
              '#00796B',
              '#FFD166',
              '#00C49F',
            ]
          : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverOffset: 8,
    },
  ];
};

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const total = dataset.data.reduce((acc, value) => acc + value, 0);
          const currentValue = dataset.data[tooltipItem.dataIndex];
          const percentage = ((currentValue / total) * 100).toFixed(2);
          return `${
            tooltipItem.label
          }: ${currentValue.toLocaleString()}원 (${percentage}%)`;
        },
      },
    },
    datalabels: {
      formatter: (value, ctx) => {
        const dataset = ctx.chart.data.datasets[0];
        const total = dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return percentage === '0.0' ? '' : `${percentage}%`;
      },
      color: '#F5F5F5',
      font: { weight: 'bold', size: 13 },
    },

    legend: {
      position: 'right',
      labels: {
        generateLabels: (chart) => {
          const data = chart.data;
          if (!data.labels || !data.datasets.length) return [];

          const dataset = data.datasets[0];

          return data.labels
            .map((label, i) => {
              const value = dataset.data[i];
              const bgColor = dataset.backgroundColor[i];

              return {
                text: `${label}: ${value.toLocaleString()}원`,
                fillStyle: bgColor,
                strokeStyle: bgColor,
                fontColor: bgColor,
                index: i,
                hidden: value === 0,
              };
            })
            .filter((item) => dataset.data[item.index] !== 0);
        },
        padding: 20,
        font: {
          size: 15,
        },
      },
    },
  },
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem) =>
          `${tooltipItem.label}: ${tooltipItem.raw.toLocaleString()}원`,
      },
    },
    datalabels: {
      formatter: (value, ctx) =>
        value === 0
          ? ''
          : `${
              ctx.chart.data.labels[ctx.dataIndex]
            }\n${value.toLocaleString()}원`,
      color: '#000', //회색 : #6B7280
      font: { weight: 'bold', size: 8 },
      align: 'top',
    },
    legend: { position: 'bottom' },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const loadExpenseData = (transactions) => {
  loadCategoryChartData({
    transactions,
    type: 'expense',
    categories: expenseCategories,
    isThreeMonth: false,
    label: `${currentYear.value}년 ${currentMonth.value}월 지출`,
  });
};

const loadIncomeData = (transactions) => {
  loadCategoryChartData({
    transactions,
    type: 'income',
    categories: incomeCategories,
    isThreeMonth: false,
    label: `${currentYear.value}년 ${currentMonth.value}월 수입`,
  });
};

const loadExpense3MData = (transactions) => {
  loadCategoryChartData({
    transactions,
    type: 'expense',
    categories: expenseCategories,
    isThreeMonth: true,
    label: '최근 3개월 지출',
  });
};

const loadIncome3MData = (transactions) => {
  loadCategoryChartData({
    transactions,
    type: 'income',
    categories: incomeCategories,
    isThreeMonth: true,
    label: '최근 3개월 수입',
  });
};

const loadProfitData = (transactions) => {
  const last3Months = getLast3Months();
  const labels = last3Months.map(({ year, month }) => `${year}년 ${month}월`);
  const profits = [];
  totalAmount.value = 0;

  last3Months.forEach(({ year, month }) => {
    let income = 0,
      expense = 0;
    transactions.forEach((t) => {
      if (isSameMonth(t.date, year, month) && t.amount) {
        if (t.type === 'income') income += t.amount;
        if (t.type === 'expense') expense += t.amount;
      }
    });
    const profit = income - expense;
    totalAmount.value += profit;
    profits.push(profit);
  });

  chartData.value.labels = labels;
  chartData.value.datasets = [
    {
      label: '최근 3개월 순이익',
      data: profits,
      fill: false,
      borderColor: '#36A2EB',
      tension: 0.1,
    },
  ];
};

const loadExpenseCompareData = (transactions) => {
  const current = { year: currentYear.value, month: currentMonth.value };
  const prev =
    currentMonth.value === 1
      ? { year: currentYear.value - 1, month: 12 }
      : { year: currentYear.value, month: currentMonth.value - 1 };

  const init = () => Object.fromEntries(expenseCategories.map((c) => [c, 0]));
  const dataCurrent = init();
  const dataPrev = init();
  totalCur.value = 0;
  totalPrev.value = 0;

  transactions.forEach((t) => {
    if (t.type !== 'expense' || !t.amount) return;
    const cat = t.category.trim();
    if (!expenseCategories.includes(cat)) return;

    if (isSameMonth(t.date, current.year, current.month)) {
      dataCurrent[cat] += t.amount;
      totalCur.value += t.amount;
    } else if (isSameMonth(t.date, prev.year, prev.month)) {
      dataPrev[cat] += t.amount;
      totalPrev.value += t.amount;
    }
  });

  chartData.value.labels = [`${prev.month}월`, `${current.month}월`];
  chartData.value.datasets = expenseCategories.map((cat, idx) => ({
    label: cat,
    data: [dataPrev[cat], dataCurrent[cat]],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#4BC0C0',
      '#9966FF',
      '#FF3B30',
      '#FF9F40',
      '#8AC926',
      '#FF6B6B',
      '#6A4C93',
      '#00796B',
      '#FFD166',
      '#00C49F',
    ][idx % 12],
    stack: 'stack1',
  }));

  totalAmount.value = totalCur.value;
};

const loadData = () => {
  isLoaded.value = false;
  chartData.value = { labels: [], datasets: [] };

  const transactions = transactionStore.transactions;

  if (selectedOption.value === 'expense') loadExpenseData(transactions);
  else if (selectedOption.value === 'income') loadIncomeData(transactions);
  else if (selectedOption.value === 'profit') loadProfitData(transactions);
  else if (selectedOption.value === 'expense-3m')
    loadExpense3MData(transactions);
  else if (selectedOption.value === 'income-3m') loadIncome3MData(transactions);
  else if (selectedOption.value === 'expense-compare')
    loadExpenseCompareData(transactions);

  if (selectedOption.value === 'expense-compare') {
    hasData.value = totalPrev.value !== 0 && totalCur.value !== 0;
  } else {
    hasData.value = totalAmount.value !== 0;
  }

  isLoaded.value = true;
};

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
};

onMounted(() => {
  transactionStore.fetchTransactions();
  loadData();
});

watch([currentMonth, currentYear, selectedOption], loadData);

watch(
  () => transactionStore.transactions,
  () => loadData(),
  { deep: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 900px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
</style>
