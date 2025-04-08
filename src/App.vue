<template>
  <div class="app-container">
    <Header />
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
