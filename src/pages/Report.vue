<template>
  <div class="container p-2 justify-content-center align-items-center">
    <!-- 총합(전체, 수입, 지출) -->
    <div class="summary-cards mb-4">
      <div class="card summary-card">
        <div class="card-body">
          <div class="summary-item">
            <h6 class="text-secondary">전체</h6>
            <p class="amount text-secondary">
              ₩{{ formatAmount(totalAmount) }}
            </p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">지출</h6>
            <p class="amount text-danger">₩{{ formatAmount(expenseTotal) }}</p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">수입</h6>
            <p class="amount text-success">₩{{ formatAmount(incomeTotal) }}</p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">사용한 돈의 시간 값</h6>
            <p class="amount text-warning">
              {{ getTimeValue(expenseTotal) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 검색 결과 헤더 -->
    <div class="d-flex align-items-center m-3">
      <span class="me-2 fw-semibold text-secondary">:전구: 검색 결과 :</span>
      <span class="badge bg-primary fs-6"
        >{{ filteredTransactions.length }} 개</span
      >
    </div>
    <!-- 필터 영역 -->
    <div class="filter">
      <!-- 기간 필터 -->
      <span class="period-filter bg-box">
        기간 :
        <input type="date" v-model="filters.startDate" class="period" /> ~
        <input type="date" v-model="filters.endDate" class="period" />
      </span>
      <!-- 자사필터 -->
      <span>
        <button class="btn btn-outline-dark bg-light" @click="toggleAsset">
          자사: {{ filters.asset || '전체' }}
        </button>
      </span>
      <!-- 분류 필터 -->
      <span>
        <button
          class="btn btn-outline-dark bg-white"
          @click="filters.type = 'expense'"
        >
          지출
        </button>
      </span>
      <span>
        <button
          class="btn btn-outline-dark bg-light"
          @click="filters.type = 'income'"
        >
          수입
        </button>
      </span>
      <!-- 금액 정렬 -->
      <span>
        <button class="btn btn-outline-dark bg-light" @click="sortByAmount">
          금액
          <span v-if="sort.amountAsc === true">▲</span>
          <span v-else-if="sort.amountAsc === false">▼</span>
        </button>
      </span>
      <!-- 메모 검색 -->
      <span class="bg-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          v-model="filters.memo"
          type="text"
          class="inputMemo"
          placeholder=":돋보기: 내용 또는 메모"
        />
      </span>
      <!-- 에크셀 다운로드 -->
      <span>
        <button
          class="btn btn-outline-success d-flex justify-content-center align-items-center p-0"
          @click="exportToExcel"
          style="width: 40px; height: 40px"
          title="에크셀 다운로드"
        >
          <img
            src="@/assets/excel_icon.png"
            alt="Excel 다운로드"
            width="24"
            height="24"
            class="excel-icon"
          />
        </button>
      </span>
      <span>
        <button class="btn btn-outline-primary" @click="resetFilters">
          초기화
        </button>
      </span>
    </div>
  </div>
  <!-- 테이블 -->
  <div class="table-responsive rounded shadow-sm overflow-hidden">
    <table
      class="table table-bordered table-hover align-middle text-center mb-0"
    >
      <thead class="table-light">
        <tr>
          <th>No.</th>
          <th>날짜</th>
          <th>자사</th>
          <th>분류</th>
          <th>금액</th>
          <th>내용</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tx, index) in filteredTransactions" :key="tx.transactionId">
          <td>{{ index + 1 }}</td>
          <td>{{ formatDate(tx.date) }}</td>
          <td>{{ tx.asset }}</td>
          <td>{{ tx.category.trim() }}</td>
          <td>{{ formatAmount(tx.amount) }} 원</td>
          <td>{{ tx.memo }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTransactionStore } from '@/stores/transaction';
const minimumWage = 10030;
const store = useTransactionStore();
const filters = ref({
  startDate: '',
  endDate: '',
  asset: '',
  type: '',
  memo: '',
});
const sort = ref({ amountAsc: null });
const formatAmount = (amount) => Number(amount).toLocaleString();
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear().toString().slice(2)}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${
    week[date.getDay()]
  })`;
};
const getTimeValue = (amount) => {
  const totalHours = amount / minimumWage;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours > 0 ? hours + '시간 ' : ''}${
    minutes > 0 ? minutes + '분' : ''
  }`;
};
const filteredTransactions = computed(() => {
  const clearTime = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  return store.transactions
    .filter((tx) => {
      const txDate = clearTime(tx.date);
      const start = filters.value.startDate
        ? clearTime(filters.value.startDate)
        : null;
      const end = filters.value.endDate
        ? clearTime(filters.value.endDate)
        : null;
      return (
        (!start || txDate >= start) &&
        (!end || txDate <= end) &&
        (!filters.value.asset || tx.asset === filters.value.asset) &&
        (!filters.value.type || tx.type === filters.value.type) &&
        (!filters.value.memo || tx.memo.includes(filters.value.memo))
      );
    })
    .sort((a, b) => {
      const baseSort = new Date(a.date) - new Date(b.date);
      if (sort.value.amountAsc === null) return baseSort;
      const amountCompare = sort.value.amountAsc
        ? a.amount - b.amount
        : b.amount - a.amount;
      return amountCompare === 0 ? baseSort : amountCompare;
    });
});
const incomeTotal = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);
const expenseTotal = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);
const totalAmount = computed(() => incomeTotal.value - expenseTotal.value);
const resetFilters = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const lastDate = String(
    new Date(yyyy, today.getMonth() + 1, 0).getDate()
  ).padStart(2, '0');
  filters.value = {
    startDate: `${yyyy}-${mm}-01`,
    endDate: `${yyyy}-${mm}-${lastDate}`,
    asset: '',
    type: '',
    memo: '',
  };
  sort.value.amountAsc = null;
};
const toggleAsset = () => {
  const assets = [...new Set(store.transactions.map((tx) => tx.asset))];
  const currentIndex = assets.indexOf(filters.value.asset);
  filters.value.asset = assets[(currentIndex + 1) % assets.length] || '';
};
const sortByAmount = () => {
  if (sort.value.amountAsc === null) sort.value.amountAsc = true;
  else if (!sort.value.amountAsc) sort.value.amountAsc = null;
  else sort.value.amountAsc = false;
};
const exportToExcel = () => {
  const data = filteredTransactions.value.map((tx, index) => ({
    No: index + 1,
    날짜: formatDate(tx.date),
    자사: tx.asset,
    분류: tx.category.trim(),
    금액: formatAmount(tx.amount),
    내용: tx.memo,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '내역');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(
    blob,
    `MoneyCheck_거래내역_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
onMounted(() => {
  store.fetchTransactions();
  resetFilters();
});
</script>

<style scoped>
/* ===== 기본 설정 ===== */
body {
  background-color: #f1f3f5;
}

.container {
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
}

/* ===== 필터 영역 ===== */
.filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.05);
}

.filter > * {
  flex: 0 1 auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
  min-height: 36px;
  justify-content: flex-start; /* ← 왼쪽 정렬 */
}
.filter span {
  margin: 2px;
}

/* ===== 기간 필터 ===== */
.period-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
}

.period-filter input {
  width: auto;
  height: 36px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding-left: 6px;
}

/* ===== 메모 필드 ===== */
.inputMemo {
  width: 200px;
  height: 36px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding-left: 8px;
}

/* ===== 버튼 ===== */
.btn {
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 8px;
  height: 36px;
}
.btn-primary {
  background-color: #6366f1;
  border-color: #6366f1;
  color: #fff;
}
.btn-outline-dark {
  border-color: #ced4da;
  color: #495057;
}
.btn-outline-dark:hover {
  background-color: #e2e6ea;
}

/* ===== 요약 영역 ===== */
.total {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.total > span {
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: 16px;
  min-width: 120px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* ===== 테이블 ===== */
.table-responsive {
  border-radius: 12px;
  overflow-x: auto;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
table {
  background-color: #fff;
  border-collapse: collapse;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

table thead {
  background-color: #f8f9fa;
}

table th,
table td {
  padding: 12px 14px;
  font-size: 0.92rem;
  color: #343a40;
  border: 1px solid #dee2e6;
}

table thead th {
  font-weight: 600;
  background-color: #f1f3f5;
}

table tbody tr:hover {
  background-color: #f6f8fa;
}

/* 반응형 유지 */
.table-responsive {
  overflow-x: auto;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 10px;
}
table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

.excel-icon:hover {
  transform: scale(1.3);
  transition: transform 0.03s ease-in-out;
}
.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  margin-bottom: 20px;
  /* justify-content: space-between; */
}
.summary-cards {
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
}

.summary-card {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.summary-card .card-body {
  display: flex;
  justify-content: space-between; /* 항목 사이에 일정한 간격을 두기 */
  padding: 10px 15px; /* 여백 추가 */
}
.no-wrap {
  white-space: nowrap; /* 줄바꿈 방지 */
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 10 15px;
}

.summary-item h6 {
  font-size: 14px;
  margin-bottom: 5px;
}

.summary-item .amount {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
.text-secondary {
  color: #7c7c7c !important;
}

.text-danger {
  color: #fd4ca7 !important;
}

.text-success {
  color: #01c12b !important;
}
/* ===== 반응형 ===== */
@media (max-width: 768px) {
  .filter {
    flex-direction: column;
    align-items: stretch;
  }

  .inputMemo,
  .period-filter,
  .filter > button {
    width: 100%;
    max-width: 100%;
  }

  .total {
    flex-direction: column;
    align-items: center;
  }

  .total > span {
    width: 90%;
  }

  .btn {
    width: 100%;
  }

  table th,
  table td {
    font-size: 0.85rem;
    white-space: nowrap;
  }
}
</style>
