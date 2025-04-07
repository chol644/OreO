import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/pages/Login.vue';
import NotFound from '@/pages/NotFound.vue';
import Signup from '@/pages/Signup.vue';
import ProfileEdit from '@/pages/ProfileEdit.vue';
import Report from '@/pages/Report.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      components: {
        default: Login,
        // left: HomeLeft,
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        default: Signup,
        // left: HomeLeft,
      },
    },
    {
      path: '/profile-edit',
      name: 'ProfileEdit',
      components: {
        default: ProfileEdit,
        // left: HomeLeft,
      },
    },
    {
      path: '/report',
      name: 'Report',
      components: {
        default: Report,
        // left: HomeLeft,
      },
    },
    {
      path: '/:pathMatch(.*)*', // 모든 경로와 일치 (정규식 사용)
      name: 'NotFound',
      component: NotFound,
    },
  ],
});
export default router;
