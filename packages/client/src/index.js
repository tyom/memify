import Vue from 'vue';
import Vuetify from 'vuetify';
import store from './store';
import router from './router';
import App from './views/App';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  el: '#root',
  store,
  router,
  render: h => h(App),
});
