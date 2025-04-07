import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/pages/Login.vue';
import NotFound from '@/pages/NotFound.vue';

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
      path: '/:pathMatch(.*)*', // 모든 경로와 일치 (정규식 사용)
      name: 'NotFound',
      component: NotFound
    }
  ],
});
export default router;