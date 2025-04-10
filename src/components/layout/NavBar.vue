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
      <div v-if="showProfileMenu" class="profile-dropdown">
        <div class="d-flex flex-column mb-2">
          <!-- 닉네임과 이메일을 줄바꿈을 해서 보이도록 처리 -->
          <p class="mb-1 text-truncate">
            <strong>닉네임:</strong> {{ userNickname }}
          </p>
          <p class="mb-1 text-truncate">
            <strong>이메일:</strong> {{ userEmail }}
          </p>
        </div>
        <button
          class="btn btn-outline-primary btn-sm w-100 mt-2"
          @click="goToProfileEdit"
        >
          내 정보 수정
        </button>
        <button
          class="btn btn-outline-primary btn-sm w-100 mt-2"
          @click="logout"
        >
          로그아웃
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
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  padding: 15px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.profile-dropdown p {
  margin: 5px 0;
  font-size: 14px;
  white-space: normal;
}

.profile-dropdown button {
  width: 100%;
  padding: 8px;
  background-color: #ceecff;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}

.profile-dropdown button:hover {
  background-color: #a9d8f4;
}
</style>
