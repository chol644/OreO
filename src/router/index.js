import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      components: {
        default: () => import('@/pages/auth/Login.vue'),
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        default: () => import('@/pages/auth/Signup.vue'),
      },
    },
    {
      path: '/profile-edit',
      name: 'ProfileEdit',
      components: {
        default: () => import('@/pages/member/ProfileEdit.vue'),
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'Calendar',
      component: () => import('@/pages/calendar/CalendarPage.vue'),
    },
    {
      path: '/transactions/add',
      name: 'addTransaction',
      redirect: '/',
      meta: { requiresAuth: true },
    },
    {
      path: '/report',
      name: 'Report',
      component: () => import('@/pages/Report.vue'),
    },
    {
      path: '/chart',
      name: 'Chart',
      component: () => import('@/pages//ChartVIew/ChartView.vue'),
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('@/pages/news/EconomyNews.vue'),
    },
    {
      path: '/exchange',
      name: 'Exchange',
      component: () => import('@/pages/exchange/ExchangeCalculator.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  let userId = localStorage.getItem('userId');

  // 로그인된 상태가 아니면 로그인 페이지로 리디렉션
  const isAuthenticated = userId && userId !== 'null' && userId !== 'undefined';

  // 로그인이 되어 있지 않다면
  if (!isAuthenticated && !['/login', '/signup'].includes(to.path)) {
    console.log('로그인 안됨, /login으로 리디렉션');
    next('/login');
  }
  // 이미 로그인된 상태라면 로그인/회원가입 페이지로 이동하면 안됨
  else if (isAuthenticated && ['/login', '/signup'].includes(to.path)) {
    console.log('이미 로그인됨, 메인 페이지로 리디렉션');
    next('/');
  } else {
    next(); // 정상적으로 페이지 이동
  }
});

export default router;
