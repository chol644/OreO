<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="btn btn-sm btn-outline-secondary" @click="prevMonth">
        <i class="bi bi-chevron-left"></i>
      </button>
      <h3>{{ currentMonthYear }}</h3>
      <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <div class="calendar-grid">
      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      <DayCell
        v-for="(day, index) in calendarDays"
        :key="index"
        :date="day.date"
        :isCurrentMonth="day.isCurrentMonth"
        :isSelected="isSameDay(day.date, selectedDate)"
        :transactions="getTransactionsForDay(day.date)"
        @click="selectDay(day.date)"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import DayCell from './DayCell.vue';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isSameDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { useTransactionStore } from '@/store/transaction';

export default defineComponent({
  name: 'CalendarView',
  components: {
    DayCell,
  },
  setup() {
    const selectedDate = ref(new Date());

    const currentDate = ref(new Date());
    const transactionsStore = useTransactionStore();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const isLoaded = ref(false);
    const currentMonthYear = computed(() => {
      return format(currentDate.value, 'yyyy년 MM월', { locale: ko });
    });
    const calendarDays = computed(() => {
      const monthStart = startOfMonth(currentDate.value);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });

      // 항상 6줄 (6 * 7 = 42일)
      const days = Array.from({ length: 42 }, (_, i) => {
        const date = new Date(calendarStart);
        date.setDate(date.getDate() + i);
        return {
          date,
          isCurrentMonth: isSameMonth(date, currentDate.value),
          isToday: isToday(date),
        };
      });

      return days;
    });

    const nextMonth = () => {
      currentDate.value = addMonths(currentDate.value, 1);
    };
    const prevMonth = () => {
      currentDate.value = subMonths(currentDate.value, 1);
    };
    const getTransactionsForDay = (date) => {
      return transactionsStore.getTransactionsByDate(date);
    };
    const selectDay = (date) => {
      selectedDate.value = date;
      transactionsStore.setSelectedDate(date);
    };

    return {
      currentDate,
      weekdays,
      currentMonthYear,
      calendarDays,
      nextMonth,
      prevMonth,
      getTransactionsForDay,
      selectDay,
      isSameDay,
      selectedDate,
    };
  },
});
</script>
<style scoped>
.calendar-container {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  height: 700px;
  /* 반응형 설정 */
  width: 100%;
  max-width: 900px; /* 원하는 최대 폭 */
  margin: 0 auto; /* 가운데 정렬 */
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(6, 1fr); /* 요일 줄은 auto, 날짜는 6줄 */
  gap: 5px;
  flex-grow: 1;
  height: 95%; /* container에 꽉 채우기 */
}

.weekday {
  text-align: center;
  font-weight: 500;
  padding: 10px;
  color: #777;
}
</style>
