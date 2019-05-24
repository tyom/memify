import Vue from 'vue';
import Vuex from 'vuex';
import { firestorePlugin } from 'vuefire';
import Vuetify from 'vuetify';
import App from './views/App.vue';
import store from './store';
import router from './router';
import 'vuetify/dist/vuetify.min.css';

Vue.use(firestorePlugin);
Vue.use(Vuex);
Vue.use(Vuetify);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#root');
