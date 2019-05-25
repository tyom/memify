import Vue from 'vue';
import VueRouter from 'vue-router';
import Meme from './views/Meme';
import Preset from './views/Preset';
import Create from './views/Create';
import PresetIndex from './views/PresetIndex';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/:memeId',
      name: 'meme',
      component: Meme,
    },
    {
      path: '/preset/:presetId',
      component: Preset,
      children: [
        {
          path: ':memeId',
          name: 'preset-meme',
          component: Meme,
        },
        {
          path: '',
          name: 'preset-index',
          component: PresetIndex,
        }
      ],
    },
    {
      path: '',
      name: 'home',
      component: Create,
    },
  ],
});
