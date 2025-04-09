<template>
  <header class="app-header">
    <!-- 상단 로고 & 내비게이션 -->
    <NavBar />
  </header>
</template>

<script>
import NavBar from '@/components/layout/NavBar.vue';

export default {
  name: 'Header',
  components: {
    NavBar,
  },
};
</script>

<style scoped>
.app-header {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}
</style>
