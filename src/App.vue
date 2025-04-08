<template>
  <div class="app-container">
    <!-- 로그인 또는 회원가입 페이지가 아닐 경우에만 Header를 표시 -->
    <Header v-if="!isAuthPage" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue';

export default {
  name: 'App',
  components: {
    Header,
  },
  computed: {
    // 현재 경로가 로그인(/login) 또는 회원가입(/signup) 페이지인지 확인
    isAuthPage() {
      return this.$route.path === '/login' || this.$route.path === '/signup';
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f9fafb;
  font-family: 'Noto Sans KR', Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
