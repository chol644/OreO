<template>
  <nav class="navbar navbar-expand-sm bg-white navbar-light">
    <RouterLink
      to="/"
      class="navbar-brand ps-2 d-flex align-items-center gap-2"
    >
      <img
        src="@/assets/logo.png"
        alt="로고"
        width="30"
        height="30"
        class="d-inline-block align-top"
      />
      머니첵
    </RouterLink>

    <button
      class="navbar-toggler"
      type="button"
      @click="isNavShow = !isNavShow"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div
      :class="
        isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
      "
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/api">달력</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/report">내역</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/chart">보고서</RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
const isNavShow = ref(false);
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid #ddd;
}

.router-link-active {
  background-color: #e0f0ff;
  color: #000 !important;
  border-radius: 0.25rem;
}
</style>
