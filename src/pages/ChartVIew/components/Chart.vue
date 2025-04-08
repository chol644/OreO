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
    </select>
  </div>

  <h2 class="mt-5 text-center font-bold text-xl">
    <template v-if="selectedOption === 'profit'"> 최근 3개월 순이익 </template>
    <template v-else>
      {{ currentYear }}년 {{ currentMonth }}월 {{ optionText }}
    </template>
  </h2>

  <div v-if="isLoaded && hasData">
    <div class="mt-5 mb-3">
      <component
        :is="selectedOption === 'profit' ? LineChart : DoughnutChart"
        :chart-data="chartData"
        :chart-options="
          selectedOption === 'profit' ? lineChartOptions : donutChartOptions
        "
      />
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
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DoughnutChart from '@/pages/ChartVIew/components/DoughnutChart.vue';
import LineChart from '@/pages/ChartVIew/components/LineChart.vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const chartData = ref({ labels: [], datasets: [] });
const totalAmount = ref(0);
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
        return percentage === '0.0'
          ? ''
          : `${ctx.chart.data.labels[ctx.dataIndex]}\n${percentage}%`;
      },
      color: '#6B7280',
      font: { weight: 'bold', size: 13 },
    },
    legend: { position: 'bottom' },
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
      color: '#6B7280',
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

  hasData.value = totalAmount.value !== 0;
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
