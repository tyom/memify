import Vue from 'vue';
import VueRouter from 'vue-router';
import Meme from './views/Meme';
import Preset from './views/Preset';
import Create from './views/Create';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/:memeId',
      name: 'meme',
      component: Meme,
    },
    {
      path: '/presets/:presetId',
      name: 'preset',
      component: Preset,
      children: [
        {
          path: ':memeId',
          name: 'preset-meme',
          component: Meme,
        }
      ]
    },
    {
      path: '',
      name: 'home',
      component: Create,
    },
  ],
});
