import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('userData')) || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
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
