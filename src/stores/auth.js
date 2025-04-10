import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userNickname: (state) => state.user?.nickname || '이름 없음',
    userEmail: (state) => state.user?.email || '이메일 없음',
  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('userData', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('userData');
    },
  },
});
