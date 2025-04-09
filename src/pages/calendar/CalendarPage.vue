<template>
  <div class="calendar-page">
    <div class="summary-cards mb-4">
      <div class="card summary-card">
        <div class="card-body">
          <div class="summary-item">
            <h6 class="text-secondary">전체</h6>
            <p class="amount text-secondary">{{ formatAmount(totalAmount) }}</p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">지출</h6>
            <p class="amount text-danger">{{ formatAmount(expenseAmount) }}</p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">수입</h6>
            <p class="amount text-success">{{ formatAmount(incomeAmount) }}</p>
          </div>
          <div class="summary-item">
            <h6 class="text-secondary">사용한 돈의 시간 가치</h6>
            <p class="amount text-warning">
              {{ getTimeValue(expenseAmount) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- 캘린더 섹션 -->
      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <CalendarView />
          </div>
        </div>
      </div>
      <!-- 오늘 거래 섹션 -->
      <div class="col-md-5">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">{{ selectedDateFormatted }}</h5>
            <button
              class="btn btn-primary btn-sm no-wrap"
              @click="openTransactionForm"
            >
              <i class="bi bi-plus"></i> 추가
            </button>
          </div>
          <div class="card-body p-0">
            <TransactionsList :transactions="selectedDateTransactions" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- AddTransactionForm 모달 -->
  <AddTransactionForm
    v-if="showAddTransactionModal"
    @close="closeTransactionForm"
  />
</template>
<script>
import { defineComponent, onMounted } from "vue";
import CalendarView from "@/components/calendar/CalendarView.vue";
import TransactionsList from "@/components/dashboard/TransactionsList.vue";
import AddTransactionForm from "@/components/transactions/AddTransactionForm.vue";
import { useTransactionStore } from "@/stores/transaction";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";

const minimumWage = 10030;

export default defineComponent({
  name: "CalendarPage",
  components: {
    CalendarView,
    TransactionsList,
    AddTransactionForm,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      today: new Date(),
      showAddTransactionModal: false,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    transactionsStore() {
      return useTransactionStore();
    },
    selectedDateTransactions() {
      return this.transactionsStore.getTransactionsBySelectedDate;
    },
    incomeAmount() {
      return this.transactionsStore.getTotalIncome;
    },
    expenseAmount() {
      return this.transactionsStore.getTotalExpense;
    },
    monthlyExpenseAmount() {
      return this.transactionsStore.getTotalMonthlyExpense; // 월별 지출 합계
    },
    totalAmount() {
      return this.incomeAmount - this.expenseAmount;
    },
    selectedMonth() {
      return format(this.transactionsStore.selectedDate, "yyyy년 MM월");
    },
    selectedDateFormatted() {
      return format(
        this.transactionsStore.selectedDate,
        "yyyy년 MM월 dd일 EEEE",
        { locale: ko }
      );
    },
  },
  methods: {
    formatAmount(amount) {
      const formatted = new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        currencyDisplay: "symbol",
      }).format(amount);

      // -₩10,000 → ₩-10,000 으로 바꿔줌
      if (formatted.startsWith("-₩")) {
        return formatted.replace("-₩", "₩-");
      }
      return formatted;
    },
    getTimeValue(amount) {
      // 시간 가치 계산 (총 시간)
      const totalHours =  amount / minimumWage;

      // 시간과 분으로 변환
      const hours = Math.floor(totalHours); // 정수 시간
      const minutes = Math.round((totalHours - hours) * 60); // 남은 시간을 분으로 환산 후 반올림

      // 결과 문자열 생성
      let resultString = "";
      if (hours > 0) {
        resultString += `${hours}시간 `;
      }
      if (minutes > 0) {
        resultString += ` ${minutes}분`;
      }

      return resultString;
    },
    openTransactionForm() {
      if (!this.authStore.isLoggedIn) {
        this.$router.push("/login");
      } else {
        this.showAddTransactionModal = true;
      }
    },

    closeTransactionForm() {
      this.showAddTransactionModal = false;
    },
    onMonthChange(newDate) {
      // 선택된 날짜 업데이트
      this.transactionsStore.setSelectedDate(newDate);

      // 새로운 월의 거래 데이터를 가져오기 위한 함수 호출
      this.transactionsStore.fetchTransactions().then(() => {
        // 데이터 가져온 후 UI를 강제로 업데이트
        this.$forceUpdate();
      });
    },
  },
  mounted() {
    if (!this.authStore.isLoggedIn) {
      this.$router.push("/login");
    } else {
      this.transactionsStore.fetchTransactions();
    }
  },
});
</script>
<style scoped>
.calendar-page {
  padding: 20px 0;
}

.row {
  display: flex;
  flex-wrap: wrap; /* 화면 크기에 따라 요소들이 아래로 내려갈 수 있도록 설정 */
  gap: 20px; /* 요소 간의 간격 */
  transition: all 0.3s ease-in-out; /* 부드럽게 크기가 변하도록 추가 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px; /* 여백 조정 */
  border-bottom: 1px solid #ddd; /* 하단 경계선 추가 */
}
.calendar-page {
  padding: 20px 0;
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
/* .card-body {
  display: flex;
  margin: 0;
  padding: 0;
} */
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

.card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: #fff;
  margin-bottom: 20px;
  /* justify-content: space-between; */
}
.col-md-7,
.col-md-5 {
  display: flex;
  flex-direction: column; /* 칼럼으로 설정하여 세로로 정렬 */
  flex: 1; /* 기본적으로 공간을 나누어 가짐 */
  transition: max-width 0.3s ease-in-out; /* 부드럽게 크기가 변하도록 추가 */
  width: 100%;
}

.col-md-7 {
  max-width: 70%;
}

.col-md-5 {
  max-width: 30%;
}

@media (max-width: 992px) {
  /* 화면 크기가 992px 이하일 때 */
  .col-md-7,
  .col-md-5 {
    max-width: 100%; /* 각 섹션이 100% 너비를 차지하도록 설정 */
  }
  .row {
    flex-direction: column; /* row를 column으로 변경해서 아래로 내려가게 설정 */
  }
}
</style>
