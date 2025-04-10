<template>
  <div class="dashboard-container">
    <div class="month-selector">
      <button class="nav-btn" @click="prevMonth">
        <i class="bi bi-chevron-left"></i>
      </button>

      <span class="month-text"> {{ currentYear }}년 {{ currentMonth }}월 </span>

      <button class="nav-btn" @click="nextMonth">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <div class="option-select">
      <select v-model="selectedOption" class="select-box">
        <option value="expense">월별 지출</option>
        <option value="income">월별 수입</option>
        <option value="profit">최근 3개월 순이익</option>
        <option value="expense-3m">최근 3개월 지출</option>
        <option value="income-3m">최근 3개월 수입</option>
        <option value="expense-compare">전월 지출 비교</option>
        <option value="income-compare">전월 수입 비교</option>
      </select>
    </div>

    <h2 class="section-title">
      <template v-if="selectedOption === 'profit'">
        최근 3개월 순이익
      </template>
      <template
        v-else-if="
          selectedOption === 'expense-compare' ||
          selectedOption === 'income-compare'
        "
      >
        {{
          currentMonth === 1
            ? `${currentYear - 1}년 12월 vs ${currentYear}년 1월`
            : `${currentYear}년 ${currentMonth - 1}월 vs ${currentMonth}월`
        }}
        {{ selectedOption === 'income-compare' ? '수입' : '지출' }} 비교
      </template>
      <template v-else>
        {{ currentYear }}년 {{ currentMonth }}월 {{ optionText }}
      </template>
    </h2>

    <div
      class="total-info"
      v-if="
        selectedOption !== 'expense-compare' &&
        selectedOption !== 'income-compare' &&
        hasData
      "
    >
      <p>
        <span class="total-label">총 {{ optionText }}: </span>
        <span
          :class="{
            expense:
              selectedOption === 'expense' || selectedOption === 'expense-3m',
            income:
              selectedOption === 'income' || selectedOption === 'income-3m',
          }"
          class="total-amount"
        >
          {{ totalAmount.toLocaleString() }}원
        </span>
      </p>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isLoaded && hasData" key="chart">
        <div class="chart-container">
          <component
            :is="chartComponent"
            :chart-data="chartData"
            :chart-options="chartOptions"
          />
          <div
            v-if="
              selectedOption === 'expense-compare' ||
              selectedOption === 'income-compare'
            "
            class="compare-info"
          >
            <p>
              <span>
                {{ currentMonth === 1 ? currentYear - 1 : currentYear }}년
                {{ currentMonth === 1 ? 12 : currentMonth - 1 }}월 총
                {{ selectedOption === 'income-compare' ? '수입' : '지출' }}:
                <span>{{ totalPrev.toLocaleString() }}원</span>
              </span>
              <span>
                {{ currentYear }}년 {{ currentMonth }}월 총
                {{ selectedOption === 'income-compare' ? '수입' : '지출' }}:
                <span>{{ totalCur.toLocaleString() }}원</span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="isLoaded && !hasData" key="nodata" class="no-data">
        <img src="@/assets/nodata.png" alt="데이터 없음" class="nodata-img" />
        <p class="no-data-text">데이터가 없습니다</p>
      </div>
      <h2 v-else key="loading" class="loading-text">
        데이터를 불러오는 중입니다...
      </h2>
    </transition>
  </div>
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
import DoughnutChart from '@/components/chart/DoughnutChart.vue';
import LineChart from '@/components/chart/LineChart.vue';
import BarChart from '@/components/chart/StackedBarChart.vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import {
  chartColors,
  expenseCategories,
  incomeCategories,
} from '@/utils/chartUtil';

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

const optionText = computed(
  () =>
    ({
      expense: '지출',
      income: '수입',
      profit: '순이익',
      'expense-3m': '최근 3개월 지출',
      'income-3m': '최근 3개월 수입',
      'expense-compare': '전월 비교 지출',
      'income-compare': '전월 비교 수입',
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
  if (
    selectedOption.value === 'expense-compare' ||
    selectedOption.value === 'income-compare'
  )
    return BarChart; // 누적 막대 차트
  return DoughnutChart;
});

const chartOptions = computed(() => {
  if (selectedOption.value === 'profit') return lineChartOptions;
  if (
    selectedOption.value === 'expense-compare' ||
    selectedOption.value === 'income-compare'
  )
    return stackedBarChartOptions;
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
        const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
        return percentage < 1 ? '' : `${percentage}%`;
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

  const sorted = Object.entries(totalByCategory)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, amount]) => amount > 0);

  const sortedLabels = sorted.map(([label]) => label);
  const sortedData = sorted.map(([_, amount]) => amount);

  chartData.value.labels = sortedLabels;
  chartData.value.datasets = [
    {
      label,
      data: sortedData,
      backgroundColor: sortedLabels.map(
        (_, i) => chartColors[i % chartColors.length]
      ),
      hoverOffset: 8,
    },
  ];
};

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 10, // 오른쪽 여백 조정 (기본 여백이 너무 클 경우)
    },
  },
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
        return percentage < 1 ? '' : `${percentage}%`;
      },
      color: '#F5F5F5',
      font: (ctx) => {
        const width = ctx.chart.width;
        return {
          weight: 'bold',
          size:
            width > 700
              ? 14
              : width > 500
              ? 12
              : width > 400
              ? 10
              : width > 300
              ? 7
              : 5,
        };
      },
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
                fontColor: '#000', // 텍스트 색상도 검정
                index: i,
                hidden: value === 0,
              };
            })
            .filter((item) => dataset.data[item.index] !== 0);
        },
        padding: 20,
        font: {
          weight: 'bold', // 글자 두껍게
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
      color: '#000',
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

  const sorted = expenseCategories
    .map((cat, idx) => ({
      label: cat,
      data: [dataPrev[cat], dataCurrent[cat]],
      total: dataPrev[cat] + dataCurrent[cat],
      color: chartColors[idx % chartColors.length],
    }))
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total);

  chartData.value.labels = [`${prev.month}월`, `${current.month}월`];
  chartData.value.datasets = sorted.map((d) => ({
    label: d.label,
    data: d.data,
    backgroundColor: d.color,
    stack: 'stack1',
  }));

  totalAmount.value = totalCur.value;
};

const loadIncomeCompareData = (transactions) => {
  const current = { year: currentYear.value, month: currentMonth.value };
  const prev =
    currentMonth.value === 1
      ? { year: currentYear.value - 1, month: 12 }
      : { year: currentYear.value, month: currentMonth.value - 1 };

  const init = () => Object.fromEntries(incomeCategories.map((c) => [c, 0]));
  const dataCurrent = init();
  const dataPrev = init();
  totalCur.value = 0;
  totalPrev.value = 0;

  transactions.forEach((t) => {
    if (t.type !== 'income' || !t.amount) return;
    const cat = t.category.trim();
    if (!incomeCategories.includes(cat)) return;

    if (isSameMonth(t.date, current.year, current.month)) {
      dataCurrent[cat] += t.amount;
      totalCur.value += t.amount;
    } else if (isSameMonth(t.date, prev.year, prev.month)) {
      dataPrev[cat] += t.amount;
      totalPrev.value += t.amount;
    }
  });

  const sorted = incomeCategories
    .map((cat, idx) => ({
      label: cat,
      data: [dataPrev[cat], dataCurrent[cat]],
      total: dataPrev[cat] + dataCurrent[cat],
      color: chartColors[idx % chartColors.length],
    }))
    .filter((d) => d.total > 0)
    .sort((a, b) => b.total - a.total);

  chartData.value.labels = [`${prev.month}월`, `${current.month}월`];
  chartData.value.datasets = sorted.map((d) => ({
    label: d.label,
    data: d.data,
    backgroundColor: d.color,
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
  else if (selectedOption.value === 'income-compare')
    loadIncomeCompareData(transactions);

  if (
    selectedOption.value === 'expense-compare' ||
    selectedOption.value === 'income-compare'
  ) {
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
/* 전체 레이아웃 */
.dashboard-container {
  font-family: 'Noto Sans KR', sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #fdfbfb, #ebedee);
  min-height: 100vh;
  color: #333;
}

/* 월 선택 및 네비게이션 */
.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.nav-btn {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.nav-btn:hover {
  background-color: #fefefe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.month-text {
  margin: 0 20px;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 옵션 선택 */
.option-select {
  text-align: center;
  margin-bottom: 20px;
}

.select-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 1rem;
  background-color: #fff;
  transition: border-color 0.3s;
}

.select-box:focus {
  outline: none;
  border-color: #888;
}

/* 섹션 제목 */
.section-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 총액 정보 */
.total-info {
  text-align: center;
  margin-bottom: 20px;
}

.total-label {
  font-size: 1rem;
  color: #7c7c7c;
}

.total-amount {
  font-size: 1.5rem;
  margin-left: 5px;
}

.total-amount.expense {
  color: #f472b6;
}

.total-amount.income {
  color: #10b981;
}

/* 차트 컨테이너 */
.chart-container {
  width: 100%;
  max-width: 900px;
  height: 400px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* 전월/당월 비교 정보 */
.compare-info {
  text-align: center;
  margin-top: 20px;
  margin-left: 10px;
  color: #6b7280;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  gap: 30px;
}
.compare-info span {
  padding: 5px;
}
/* 데이터 없을 경우 */
.no-data {
  text-align: center;
  margin-top: 30px;
}

.nodata-img {
  width: 400px;
  padding-top: 30px;
  opacity: 0.7;
  margin: 0 auto;
}

.no-data-text {
  color: #999;
  font-size: 18px;
  margin-top: 10px;
}

/* 로딩 상태 */
.loading-text {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 40px;
}

/* 페이드 인/아웃 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
