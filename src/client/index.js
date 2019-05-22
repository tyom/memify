import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import App from './components/App.vue';
import store from './store';
import router from './router';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuex);
Vue.use(Vuetify);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#root');
