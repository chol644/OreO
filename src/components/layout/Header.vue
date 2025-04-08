<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <img src="@/assets/logo.png" alt="가계부 로고" height="40" />
        </div>
        <NavBar />
      </div>
    </div>
  </header>
</template>
<script>
import NavBar from './NavBar.vue';
export default {
  name: 'Header',
  components: {
    NavBar,
  },
};
</script>
<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 16px 0;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 40px;
}
.logo-img {
  height: 300px; /* 로고 크기를 키우기 */
  width: auto; /* 비율 유지 */
}
</style>
