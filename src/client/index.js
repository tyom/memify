import Vue from 'vue';
import VueKonva from 'vue-konva';
import VueRouter from 'vue-router'
import Vuetify from 'vuetify';
import App from './App.vue';
import 'vuetify/dist/vuetify.min.css';


Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueKonva);

const router = new VueRouter({
  routes: [
    { path: '/:preset', name: 'preset', component: App },
  ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#root');
