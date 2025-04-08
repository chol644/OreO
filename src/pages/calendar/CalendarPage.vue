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
        </div>
      </div>
    </div>
    <div class="row">
      <!-- 캘린더 섹션 -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <CalendarView />
          </div>
        </div>
      </div>
      <!-- 오늘 거래 섹션 -->
      <div class="col-md-4">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">{{ selectedDateFormatted }}</h5>
            <button class="btn btn-primary btn-sm" @click="openTransactionForm">
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
import { defineComponent, onMounted } from 'vue';
import CalendarView from '@/components/calendar/CalendarView.vue';
import TransactionsList from '@/components/dashboard/TransactionsList.vue';
import AddTransactionForm from '@/components/transactions/AddTransactionForm.vue';
import { useTransactionStore } from '@/stores/transaction';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CalendarPage',
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
    totalAmount() {
      return this.incomeAmount - this.expenseAmount;
    },
    selectedDateFormatted() {
      return format(
        this.transactionsStore.selectedDate,
        'yyyy년 MM월 dd일 EEEE',
        { locale: ko }
      );
    },
  },
  methods: {
    formatAmount(amount) {
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        currencyDisplay: 'symbol',
      }).format(amount);

      // -₩10,000 → ₩-10,000 으로 바꿔줌
      if (formatted.startsWith('-₩')) {
        return formatted.replace('-₩', '₩-');
      }
      return formatted;
    },
    openTransactionForm() {
      if (!this.authStore.isLoggedIn) {
        this.$router.push('/login');
      } else {
        this.showAddTransactionModal = true;
      }
    },

    closeTransactionForm() {
      this.showAddTransactionModal = false;
    },
  },
  mounted() {
    if (!this.authStore.isLoggedIn) {
      this.$router.push('/login');
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

.card-body {
  display: flex;
  padding: 20px;
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 0 15px;
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
}
</style>
