<template>
  <div class="transactions-list">
    <div v-if="transactions.length === 0" class="no-transactions">
      <p class="no-text">거래 내역이 없습니다.</p>
    </div>

    <div v-else>
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import TransactionItem from '../transactions/TransactionItem.vue';

export default defineComponent({
  name: 'TransactionsList',
  components: {
    TransactionItem,
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style scoped>
.transactions-list {
  background: white;
  border-radius: 0 0 8px 8px;
}

.no-transactions {
  padding: 0; /* 여백 제거 */
}

.no-text {
  text-align: left;
  padding: 16px; /* 상하좌우 여백 */
  color: #6c757d; /* 연한 회색 */
  font-size: 14px;
  margin: 0; /* 기본 마진 제거 */
}
</style>
