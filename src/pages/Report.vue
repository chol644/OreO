<template>
  <div class="container p-2 justify-content-center align-items-center">
    <!-- 검색 결과 헤더 -->
    <div class="d-flex align-items-center mb-3">
      <span class="me-2 fw-semibold text-secondary">검색 결과 :</span>
      <span class="badge bg-primary fs-6"
        >{{ filteredTransactions.length }} 건</span
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

      <!-- 자산 필터 -->
      <span>
        <button class="btn btn-outline-dark bg-light" @click="toggleAsset">
          자산: {{ filters.asset || '전체' }}
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

      <!-- 금액 오름순/내림순 -->
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
          placeholder="🔍 내용 또는 메모"
        />
      </span>
      <!-- 엑셀 다운로드 아이콘 -->
      <div class="d-flex justify-content-center">
        <span
          @click="exportToExcel"
          class="btn btn-outline-success d-flex justify-content-center align-items-center p-0"
          style="width: 40px; height: 40px"
        >
          <img
            src="@/assets/excel_icon.png"
            title="엑셀 다운로드"
            alt="Excel 다운로드"
            width="24"
            height="24"
            class="excel-icon"
            style="display: block; margin: auto"
          />
        </span>

        <!-- 초기화 -->
        <span>
          <button class="btn btn-primary float-end" @click="resetFilters">
            초기화
          </button>
        </span>
      </div>
    </div>

    <!-- 총합(전체, 수입, 지출) -->
    <div class="total d-flex justify-content-center gap-2 flex-wrap my-3">
      <span class="bg-secondary text-white">
        전체({{ filteredTransactions.length }})<br />
        <b>{{ formatAmount(totalAmount) }} 원</b>
      </span>
      <span class="bg-success text-white">
        수입({{ incomeCount }})<br />
        <b>{{ formatAmount(incomeTotal) }} 원</b>
      </span>
      <span class="bg-danger text-white">
        지출({{ expenseCount }})<br />
        <b>{{ formatAmount(expenseTotal) }} 원</b>
      </span>
    </div>

    <!-- 테이블 -->
    <div class="table-responsive rounded shadow-sm overflow-hidden">
      <table
        class="table table-bordered table-hover align-middle text-center mb-0"
      >
        <thead class="table-light">
          <tr>
            <th scope="col">No.</th>
            <th scope="col">날짜</th>
            <th scope="col">자산</th>
            <th scope="col">분류</th>
            <th scope="col">금액</th>
            <th scope="col">내용</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(tx, index) in filteredTransactions"
            :key="tx.transactionId"
          >
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
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default {
  name: 'ReportPage',
  data() {
    return {
      userId: 'yerin01',
      transactions: [],
      filters: {
        startDate: '',
        endDate: '',
        asset: '',
        type: '', // 'income' or 'expense'
        memo: '',
      },
      sort: {
        amountAsc: null, // 금액 정렬
      },
    };
  },
  computed: {
    // 날짜 필터링
    filteredTransactions() {
      const clearTime = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // 시간 00:00으로 초기화
        return d;
      };

      const filtered = this.transactions.filter((tx) => {
        const txDate = clearTime(tx.date);
        const start = this.filters.startDate
          ? clearTime(this.filters.startDate)
          : null;
        const end = this.filters.endDate
          ? clearTime(this.filters.endDate)
          : null;

        return (
          (!start || txDate >= start) &&
          (!end || txDate <= end) &&
          (!this.filters.asset || tx.asset === this.filters.asset) &&
          (!this.filters.type || tx.type === this.filters.type) &&
          (!this.filters.memo || tx.memo.includes(this.filters.memo))
        );
      });

      // 기본 날짜 오름차순
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

      if (this.sort.amountAsc !== null) {
        filtered.sort((a, b) => {
          const amountCompare = this.sort.amountAsc
            ? a.amount - b.amount
            : b.amount - a.amount;

          if (amountCompare === 0) {
            return new Date(a.date) - new Date(b.date);
          }

          return amountCompare;
        });
      }

      return filtered;
    },

    incomeCount() {
      // 수입 카운트
      return this.filteredTransactions.filter((tx) => tx.type === 'income')
        .length;
    },
    expenseCount() {
      // 지출 카운트
      return this.filteredTransactions.filter((tx) => tx.type === 'expense')
        .length;
    },
    incomeTotal() {
      // 수입 총합
      return this.filteredTransactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
    },
    expenseTotal() {
      // 지출 총합
      return this.filteredTransactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
    },
    totalAmount() {
      // 총 합계
      return this.incomeTotal - this.expenseTotal;
    },
  },
  methods: {
    fetchTransactions() {
      fetch('http://localhost:3000/users')
        .then((res) => res.json())
        .then((users) => {
          const user = users.find((u) => u.id?.trim() === this.userId?.trim());
          if (user && user.transactions) {
            this.transactions = user.transactions;
          } else {
            alert('해당 사용자 또는 거래내역이 없습니다.');
          }
        })
        .catch((err) => {
          console.error('데이터 로드 실패:', err);
        });
    },
    formatAmount(amount) {
      return Number(amount).toLocaleString();
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const week = ['일', '월', '화', '수', '목', '금', '토'];
      return `${date.getFullYear().toString().slice(2)}.${String(
        date.getMonth() + 1
      ).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${
        week[date.getDay()]
      })`;
    },
    resetFilters() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
      // 해당 월의 마지막 날 구하기
      const lastDay = new Date(yyyy, today.getMonth() + 1, 0).getDate(); // 다음 달 0일 = 이번 달 마지막 날
      const lastDate = String(lastDay).padStart(2, '0');

      this.filters = {
        startDate: `${yyyy}-${mm}-01`,
        endDate: `${yyyy}-${mm}-${lastDate}`,
        asset: '',
        type: '',
        memo: '',
      };

      this.sort.amountAsc = null;
    },
    toggleAsset() {
      const assets = [...new Set(this.transactions.map((tx) => tx.asset))];
      const currentIndex = assets.indexOf(this.filters.asset);
      this.filters.asset = assets[(currentIndex + 1) % assets.length] || '';
    },
    // 금액 정렬
    sortByAmount() {
      // null → true → false → null
      if (this.sort.amountAsc === null) {
        this.sort.amountAsc = true;
      } else if (!this.sort.amountAsc) {
        this.sort.amountAsc = null;
      } else {
        this.sort.amountAsc = !this.sort.amountAsc;
      }
    },
    exportToExcel() {
      // 1. export할 데이터 만들기
      const data = this.filteredTransactions.map((tx, index) => ({
        No: index + 1,
        날짜: this.formatDate(tx.date),
        자산: tx.asset,
        분류: tx.category.trim(),
        금액: this.formatAmount(tx.amount),
        내용: tx.memo,
      }));

      // 2. 워크시트/워크북 생성
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '내역');

      // 3. 파일 저장
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
      saveAs(
        blob,
        `MoneyCheck_거래내역_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    },
  },
  mounted() {
    this.userId = localStorage.getItem('userId');
    this.fetchTransactions();
    this.resetFilters();
  },
};
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
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
}

/* ===== 필터 영역 ===== */
.filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
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
}
table {
  background-color: white;
}
table th,
table td {
  vertical-align: middle !important;
  padding: 12px;
}
table tbody tr:hover {
  background-color: #f1f3f5;
  transition: background-color 0.2s ease;
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
  .excel-icon:hover {
    transform: scale(1.3);
    transition: transform 0.03s ease-in-out;
  }
}
</style>
