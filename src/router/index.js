import axios from 'axios';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Qmanager from '../views/Qmanager.vue';
import Quser from '../views/Quser.vue';
import Questionnaire from '../views/Questionnaire.vue';
import AdminQuestions from '../views/AdminQuestions.vue';
import AdminQuestionnaires from '../views/AdminQuestionnaires.vue';
import AdminStatus from '../views/AdminStatus.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/quser',
    name: 'Quser',
    component: Quser,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/qmanager',
    name: 'Qmanager',
    component: Qmanager,
    children: [
      {
        path: 'questions',
        component: AdminQuestions,
      },
      {
        path: 'questionnaires',
        component: AdminQuestionnaires,
      },
      {
        path: '',
        component: AdminStatus,
      },
    ],
  },
  {
    path: '/questionnaire/:qid',
    component: Questionnaire,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // const jwt = Vue.$cookies.get('jwt_token');
  // const jwtRefresh = Vue.$cookies.get('jwt_refresh_token');
  const jwt = localStorage.getItem('jwt_token');
  const jwtRefresh = localStorage.getItem('jwt_refresh_token');
  const publicPages = ['/', '/login', '/register', '/home', '/about'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired) {
    axios.post(`${this.$BASE_API_URL}verify/`, { token: `${jwt}` }).then(() => {
      // const user = JSON.parse(localStorage.user);
      // if (to.path === '/qmanager' && !user.is_staff) next('/quser');
      next();
    }).catch(() => {
      axios.post(`${this.$BASE_API_URL}refresh/`, { refresh: `${jwtRefresh}` }).then((response) => {
        Vue.$cookies.set('jwt_token', response.data.access);
        next();
      }).catch(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_refresh_token');
        // Vue.$cookies.remove('jwt_refresh_token');
        // Vue.$cookies.remove('jwt_token');
        next('/login');
      });
    });
  } else {
    next();
  }
});

export default router;
