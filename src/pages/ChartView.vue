<template>
  <!-- 전체 컨테이너를 감싸는 div -->
  <div class="container">
    <Chart />
  </div>
</template>

<script setup>
import Chart from '@/pages/ChartVIew/components/Chart.vue';

// import Loading from '@/components/Loading.vue';

// store 정의 함수 가져오기
// import { useTodoListStore } from '@/stores/todoList.js';

// store 객체 생성
// const todoListStore = useTodoListStore();
// const { fetchTodoList } = todoListStore;
// const isLoading = computed(() => todoListStore.isLoading);

/* 앱이 시작될 때 TodoList를 가져옴 */
// fetchTodoList();
</script>
