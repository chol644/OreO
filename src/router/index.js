import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/pages/Login.vue';
import NotFound from '@/pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      components: {
        default: Login,
        // left: HomeLeft,
      },
    },
    {
      path: '/:pathMatch(.*)*', // 모든 경로와 일치 (정규식 사용)
      name: 'NotFound',
      component: NotFound,
    },
    {
      path: '/',
      name: 'Calendar',
      component: () => import('../pages/CalendarPage.vue'),
    },
    {
      path: '/transactions/add',
      name: 'addTransaction',
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
      path: '/:pathMatch(.*)*', // 모든 경로와 일치 (정규식 사용)
      name: 'NotFound',
      component: NotFound,
    },
  ],
});
export default router;
