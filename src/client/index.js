import Vue from 'vue';
import VueKonva from 'vue-konva';
import VueRouter from 'vue-router'
import App from './App.vue';
import './global.css';

Vue.use(VueRouter);
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
