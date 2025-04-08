<!-- src/components/transactions/DeleteTransactionForm.vue -->
<template>
  <div class="delete-form">
    <span class="delete-hint">정말 삭제할까요?</span>
    <div class="actions">
      <button class="confirm-btn" @click="handleConfirm">삭제</button>
      <button class="cancel-btn" @click="$emit('close')">취소</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useTransactionStore } from '@/store/transaction';

export default defineComponent({
  name: 'DeleteTransactionForm',
  props: {
    transactionId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useTransactionStore();

    const handleConfirm = async () => {
      try {
        await store.deleteTransaction(props.transactionId);
        alert('삭제 완료!');
        emit('close');
      } catch (err) {
        alert('삭제 실패!');
      }
    };

    return { handleConfirm };
  },
});
</script>

<style scoped>
.delete-form {
  /* ... 기존 스타일 유지 */
  flex-shrink: 0; /* 부모에서 눌리는 걸 방지 */
  flex-grow: 0; /* 커지지도 않게 */
  width: fit-content; /* 내용 크기만큼만 */
  max-width: 300px; /* 너무 길어지는 건 방지 */
}

.delete-hint {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  flex-shrink: 0; /* 줄바꿈 방지 */
}

.actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.confirm-btn,
.cancel-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 28px;
  min-width: 50px;
  text-align: center;
}

.confirm-btn {
  background-color: #ff5e5e;
  color: white;
}

.cancel-btn {
  background-color: #ccc;
  color: black;
}
</style>
