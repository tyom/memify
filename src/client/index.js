import Vue from 'vue';
import VueRouter from 'vue-router'
import Vuetify from 'vuetify';
import {Vue2Storage} from 'vue2-storage';
import App from './components/App.vue';
import 'vuetify/dist/vuetify.min.css';


Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(Vue2Storage, {
  prefix: 'memify_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000 // 24 hours
});

const router = new VueRouter({
  routes: [
    { path: '/:preset', name: 'preset', component: App },
  ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#root');
