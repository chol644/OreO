<template>
  <div class="transaction-form-overlay">
    <div class="form-container">
      <h5 class="form-title text-center mb-4">{{ formattedDate }}</h5>

      <div class="form-box">
        <div class="form-line d-flex align-items-center">
          <label class="form-label">종류</label>
          <select class="form-select ms-auto" v-model="type">
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </select>
        </div>

        <div class="form-line d-flex align-items-center">
          <label class="form-label">금액</label>
          <input
            type="number"
            class="form-control ms-auto"
            v-model.number="amount"
            placeholder="금액 입력"
          />
        </div>

        <div class="form-line d-flex align-items-center">
          <label class="form-label">분류</label>
          <select class="form-select ms-auto" v-model="category">
            <option v-for="c in categories" :key="c" :value="c">
              {{ getDisplayCategory(c) }}
            </option>
          </select>
        </div>

        <div class="form-line d-flex align-items-center">
          <label class="form-label">자산</label>
          <select class="form-select ms-auto" v-model="asset">
            <option>카드</option>
            <option>현금</option>
          </select>
        </div>

        <div class="form-line d-flex align-items-center">
          <label class="form-label">메모</label>
          <input type="text" class="form-control ms-auto" v-model="memo" />
        </div>
      </div>

      <div class="form-actions mt-4 d-flex justify-content-between">
        <button class="btn btn-outline-secondary" @click="$emit('close')">
          취소
        </button>
        <button class="btn btn-primary" @click="updateTransaction">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTransactionStore } from '@/stores/transaction';
import { storeToRefs } from 'pinia';
import {
  incomeCategoryMap,
  expenseCategoryMap,
  getDisplayCategory,
  removeEmoji,
} from '@/utils/emojiMap';
import { showAlert } from '@/utils/alert';

export default {
  name: 'UpdateTransactionForm',
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      type: this.transaction.type,
      amount: this.transaction.amount,
      category: this.transaction.category,
      asset: this.transaction.asset,
      memo: this.transaction.memo,
    };
  },
  computed: {
    categories() {
      return this.type === 'income'
        ? Object.keys(incomeCategoryMap)
        : Object.keys(expenseCategoryMap);
    },
    formattedDate() {
      return format(new Date(this.transaction.date), 'yyyy년 M월 d일 (EEE)', {
        locale: ko,
      });
    },
  },
  methods: {
    getDisplayCategory(category) {
      return getDisplayCategory(category, this.type);
    },
    removeEmoji(category) {
      return removeEmoji(category);
    },
    async updateTransaction() {
      if (!this.amount || this.amount <= 0) {
        showAlert({
          text: '금액을 올바르게 입력해주세요.',
        });
        return;
      }

      if (!this.category) {
        showAlert({
          text: '분류를 선택해주세요.',
        });
        return;
      }

      if (!this.asset) {
        showAlert({
          text: '자산을 선택해주세요.',
        });
        return;
      }

      const store = useTransactionStore();
      const updatedTransaction = {
        transactionId: this.transaction.transactionId,
        type: this.type,
        amount: this.amount,
        category: this.removeEmoji(this.category),
        asset: this.asset,
        memo: this.memo,
        date: this.transaction.date,
      };

      try {
        await store.updateTransaction(updatedTransaction);
        await store.fetchTransactions();
        this.$emit('close');
      } catch (err) {
        console.error('수정 실패:', err);
        alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
  },
};
</script>

<style scoped>
/* 기존 스타일 동일 */
.transaction-form-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 30px 25px;
  z-index: 1000;
  overflow-y: auto;
}

.form-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.form-box {
  background: #f9fafb;
  border: 0.5px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.form-line {
  margin-bottom: 16px;
}

.form-label {
  width: 60px;
  font-weight: bold;
  color: #333;
}

.form-control,
.form-select {
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.1rem rgba(13, 110, 253, 0.25);
  outline: none;
}

.form-actions button {
  width: 48%;
}
</style>
