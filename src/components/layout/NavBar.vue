<template>
  <nav class="main-nav">
    <!-- 로고 -->
    <router-link to="/" class="logo-link">
      <img src="../../assets/logo.png" alt="로고" class="logo" />
    </router-link>

    <!-- 메뉴 -->
    <div class="nav-container">
      <!-- 내비게이션 링크 -->
      <div class="nav-links">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="active"
        >
          {{ link.name }}
        </router-link>
      </div>
    </div>

    <!-- 우측: 프로필 아이콘 및 드롭다운 -->
    <div class="profile-menu">
      <i
        class="bi bi-person-circle"
        @click="toggleProfileMenu"
        style="cursor: pointer; font-size: 24px"
      ></i>
      <!-- 드롭다운 -->
      <div v-if="showProfileMenu" class="profile-dropdown shadow-lg">
        <div class="user-info d-flex align-items-center gap-3 mb-3">
          <i class="bi bi-person-circle fs-2 text-primary"></i>
          <div class="text-start">
            <div class="fw-semibold fs-6 text-dark">{{ userNickname }}</div>
            <div class="text-muted small">{{ userEmail }}</div>
          </div>
        </div>
        <hr />
        <button class="btn profile-btn w-100" @click="goToProfileEdit">
          ✏️ 내 정보 수정
        </button>
        <button class="btn profile-btn w-100" @click="logout">
          🔒 로그아웃
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      navLinks: [
        { name: '달력', path: '/' },
        { name: '내역', path: '/report' },
        { name: '차트', path: '/chart' },
        { name: '뉴스', path: '/news' },
        { name: '카드', path: '/cards' },
        { name: '환율 계산기', path: '/exchange' },
      ],
      showProfileMenu: false, // 프로필 메뉴 토글 상태
      userNickname: '', // 사용자 닉네임
      userEmail: '', // 사용자 이메일
    };
  },
  methods: {
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    goToProfileEdit() {
      this.$router.push('/profile-edit');
    },
    logout() {
      localStorage.removeItem('userId');
      localStorage.removeItem('userNickname');
      localStorage.removeItem('userEmail');
      this.$router.push('/login');
    },
  },
  mounted() {
    const nickname = localStorage.getItem('userNickname');
    const email = localStorage.getItem('userEmail');
    this.userNickname = nickname || '이름 없음';
    this.userEmail = email || '이메일 없음';
  },
};
</script>

<style scoped>
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background-color: white;
  border-bottom: 1px solid #ddd;

  /* 추가: 최대 너비 설정 및 가운데 정렬 */
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 24px; */
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  margin-top: 10px;
  height: 60px;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.menu-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
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

.profile-menu {
  position: relative;
}

.profile-dropdown {
  position: absolute;
  top: 35px;
  right: 0;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  width: 260px;
  z-index: 999;
  border: 1px solid #ddd;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}
.profile-btn {
  background-color: #e0f0ff;
  color: #0077b6;
  border: 1px solid #bde0fe;
  font-weight: 500;
  font-size: 14px;
  padding: 8px;
  transition: background-color 0.2s ease;
  margin-top: 8px;
}

.profile-btn:hover {
  background-color: #cde9ff;
  color: #005f99;
}

.profile-dropdown p {
  margin: 5px 0;
  font-size: 14px;
  white-space: normal;
}

.user-info .text-muted {
  font-size: 0.85rem;
}
</style>
