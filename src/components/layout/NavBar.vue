<template>
  <nav class="main-nav">
    <router-link
      v-for="link in navLinks"
      :key="link.path"
      :to="link.path"
      class="nav-link"
      active-class="active"
    >
      {{ link.name }}
    </router-link>
  </nav>
</template>
<script>
export default {
  name: 'NavBar',
  data() {
    return {
      navLinks: [
        { name: '달력', path: '/' },
        { name: '내역', path: '/transactions' },
        { name: '차트', path: '/chart' },
      ],
    };
  },
};
</script>
<style scoped>
.main-nav {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.nav-link {
  display: inline-block;
  padding: 10px 24px;
  margin: 0 30px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
}
.nav-link:hover {
  background-color: #ceecff;
}
.nav-link.active {
  background-color: #ceecff;
  font-weight: bold;
}
</style>
