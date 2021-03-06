import Vue from 'vue';
import Vuetify from 'vuetify';
import { firestorePlugin } from 'vuefire';
import store from './store';
import router from './router';
import App from './App';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.use(firestorePlugin);

Vue.config.productionTip = false;

new Vue({
  el: '#root',
  store,
  router,
  render: h => h(App),
});
