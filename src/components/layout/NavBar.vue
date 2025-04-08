<template>
  <nav class="main-nav">
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
    <div class="profile-menu">
      <i
        class="bi bi-person-circle"
        @click="toggleMenu"
        style="cursor: pointer; font-size: 24px"
      ></i>
      <div v-if="showMenu" class="profile-dropdown">
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
        { name: '내역', path: '/transactions' },
        { name: '차트', path: '/reports' },
      ],
      showMenu: false, // 메뉴 토글 상태
      userNickname: '', // 사용자 닉네임
      userEmail: '', // 사용자 이메일
    };
  },
  methods: {
    // 메뉴 토글 함수
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },

    // 로그아웃 함수
    logout() {
      localStorage.removeItem('userId'); // userId 삭제
      localStorage.removeItem('userNickname'); // 닉네임 삭제
      localStorage.removeItem('userEmail'); // 이메일 삭제
      this.$router.push('/login'); // 로그인 페이지로 리디렉션
    },
  },
  mounted() {
    // 로컬스토리지에서 사용자 정보 불러오기
    const nickname = localStorage.getItem('userNickname');
    const email = localStorage.getItem('userEmail');

    if (nickname && email) {
      this.userNickname = nickname;
      this.userEmail = email;
    } else {
      // 정보가 없으면 기본값 설정 (로그인된 상태에서만 이 정보가 있어야 함)
      this.userNickname = '이름 없음';
      this.userEmail = '이메일 없음';
    }
  },
};
</script>

<style scoped>
.main-nav {
  display: flex;
  justify-content: space-between; /* 링크와 프로필 메뉴 양쪽 끝으로 배치 */
  margin: 0 auto;
  position: relative;
  width: 100%; /* 부모 요소에 맞게 넓이 설정 */
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
.main-nav .nav-link {
  margin: 0 10px; /* 메뉴 링크들 간의 간격을 좁히기 위한 설정 */
}
.nav-link:hover {
  background-color: #ceecff;
}
.nav-links {
  display: flex;
  justify-content: center;
  flex-grow: 1; /* 가운데 정렬을 위해 남는 공간 차지 */
  gap: 60px; /* 링크들 간 간격 좁히기 */
}
.nav-link.active {
  background-color: #ceecff;
  font-weight: bold;
}

.profile-menu {
  position: relative;
  margin-right: 20px;
}

.profile-dropdown {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  padding: 15px; /* 패딩을 더 넓게 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px; /* 창 크기 더 넓게 조정 */
  z-index: 10;
}

.profile-dropdown p {
  margin: 5px 0;
  font-size: 14px;
  white-space: normal; /* 줄바꿈 허용 */
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
