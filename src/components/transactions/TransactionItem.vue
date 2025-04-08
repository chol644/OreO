<template>
  <div
    class="transaction-item"
    :class="{ income: isIncome, expense: !isIncome }"
  >
    <div class="transaction-info">
      <div class="category">{{ categoryWithEmoji }}</div>
      <div class="memo">{{ transaction.memo }}</div>
    </div>
    <div class="transaction-actions">
      <div
        class="transaction-amount"
        :class="{ 'text-success': isIncome, 'text-danger': !isIncome }"
      >
        {{ formattedAmount }}
      </div>
      <div v-if="!showDelete" class="action-buttons">
        <button class="edit-btn" @click="showEdit = !showEdit">
          {{ showEdit ? '닫기' : '수정' }}
        </button>
        <button class="delete-btn" @click="showDelete = true">삭제</button>
      </div>
      <DeleteTransactionForm
        v-if="showDelete"
        :transaction-id="transaction.transactionId"
        @close="showDelete = false"
      />
    </div>

    <UpdateTransactionForm
      v-if="showEdit"
      :transaction="transaction"
      @close="showEdit = false"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { emojiMap, getDisplayCategory } from '@/utils/emojiMap';
import UpdateTransactionForm from '@/components/transactions/UpdateTransactionForm.vue';
import DeleteTransactionForm from '@/components/transactions/DeleteTransactionForm.vue';

export default defineComponent({
  name: 'TransactionItem',
  components: {
    UpdateTransactionForm,
    DeleteTransactionForm,
  },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showEdit = ref(false);
    const showDelete = ref(false);

    const isIncome = computed(() => {
      return props.transaction.type === 'income';
    });

    const formattedAmount = computed(() => {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(props.transaction.amount);
    });
    const categoryWithEmoji = computed(() => {
      const { category, type } = props.transaction;
      return getDisplayCategory(category, type);
    });

    return {
      isIncome,
      formattedAmount,
      categoryWithEmoji,
      showEdit,
      showDelete,
    };
  },
});
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  gap: 150px; /* 이걸로 간격 넓힘 */
  padding: 10px 16px;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
  overflow: hidden; /* 내부 요소 말줄임 처리를 위해 필요 */
}

.category {
  font-weight: 500;
  margin-bottom: 2px;

  white-space: nowrap; /* 줄바꿈 방지 */
}

.memo {
  font-size: 12px;
  color: #777;
}

.transaction-amount {
  font-weight: 600;
}

.text-success {
  color: #01c12b !important;
}

.text-danger {
  color: #fd4ca7 !important;
}
.transaction-actions {
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
  align-items: center;
  gap: 6px;
}
.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.edit-btn,
.delete-btn {
  min-width: 50px; /* 버튼 너비 통일 */
  height: 28px; /* 버튼 높이 통일 */
  font-size: 12px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.edit-btn {
  background-color: #e0f7ff;
  color: #0077b6;
}

.delete-btn {
  background-color: #ffe0e0;
  color: #d00000;
}
</style>
