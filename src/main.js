import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueCookies);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
// Vue.prototype.$BASE_API_URL = 'http://localhost:8080/api/';
Vue.prototype.$BASE_API_URL = 'http://95.165.133.240/api/';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
