<template>
  <nav class="main-nav">
    <!-- 로고 -->
    <router-link to="/" class="logo-link">
      <img src="../../assets/logo.png" alt="로고" class="logo" />
    </router-link>

    <!-- 전체 내비게이션 메뉴 -->
    <div class="nav-links d-none d-md-flex">
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

    <!-- 모바일용 우측 햄버거 + 프로필 -->
    <div class="nav-right d-flex align-items-center gap-3">
      <div class="menu-toggle d-md-none" @click="toggleMenu">
        <i class="bi bi-list"></i>
      </div>
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
    </div>

    <!-- 모바일 메뉴 -->
    <div :class="['mobile-nav d-md-none', { open: isMenuOpen }]">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="nav-link"
        active-class="active"
        @click="isMenuOpen = false"
      >
        {{ link.name }}
      </router-link>
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
      showProfileMenu: false,
      isMenuOpen: false,
      userNickname: '',
      userEmail: '',
    };
  },
  methods: {
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
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
    this.userNickname = localStorage.getItem('userNickname') || '이름 없음';
    this.userEmail = localStorage.getItem('userEmail') || '이메일 없음';
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
  padding: 0 16px;
}

.logo {
  height: 60px;
  margin-top: 10px;
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

.menu-toggle {
  font-size: 20px;
  cursor: pointer;
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

.user-info .text-muted {
  font-size: 0.85rem;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  gap: 12px;
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  background-color: #fff;
  padding: 12px 0;
  z-index: 99;
  border-top: 1px solid #eee;
}

.mobile-nav.open {
  display: flex;
}
</style>
