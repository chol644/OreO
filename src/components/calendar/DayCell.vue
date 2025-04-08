<template>
  <div
    class="day-cell"
    :class="{
      'current-month': isCurrentMonth,
      'other-month': !isCurrentMonth,
      selected: isSelected,
    }"
    @click="$emit('click')"
  >
    <div class="day-number">{{ dayNumber }}</div>
    <div class="transactions-summary" v-if="hasSummary">
      <div class="expense" v-if="expense > 0">
        <span class="text-danger">{{ formatAmount(expense) }}</span>
      </div>
      <div class="income" v-if="income > 0">
        <span class="text-success">{{ formatAmount(income) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { format } from 'date-fns';

export default defineComponent({
  name: 'DayCell',
  props: {
    date: {
      type: Date,
      required: true,
    },
    isCurrentMonth: {
      type: Boolean,
      default: false,
    },
    isToday: {
      type: Boolean,
      default: false,
    },
    transactions: {
      type: Array,
      default: () => [],
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props) {
    const dayNumber = computed(() => {
      return format(props.date, 'd');
    });

    const income = computed(() => {
      return props.transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const expense = computed(() => {
      return props.transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const hasSummary = computed(() => {
      return income.value > 0 || expense.value > 0;
    });

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return {
      dayNumber,
      income,
      expense,
      hasSummary,
      formatAmount,
    };
  },
});
</script>

<style scoped>
.day-cell {
  border-radius: 8px;
  padding: 8px;
  min-height: 80px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.day-cell:hover {
  background: #f5f5f5;
}

.day-cell.other-month {
  opacity: 0.5;
}

.day-cell.selected {
  background: #e8f4ff; /* 하늘색 배경 */
  font-weight: bold;
}

.day-number {
  font-size: 14px;
  margin-bottom: 5px;
}

.transactions-summary {
  font-size: 12px;
}

.expense,
.income {
  margin-top: 2px;
}

.text-danger {
  color: #fd4ca7 !important;
}

.text-success {
  color: #01c12b !important;
}
</style>
