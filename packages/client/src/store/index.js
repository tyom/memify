import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: 'memify',
});

export const state = {
  preset: undefined,
  memes: {},
  newMeme: {
    image: {
      src: '',
    },
    caption: {
      fill: '#fcc400',
      fontFamily: 'Acme',
      fontSize: 30,
      height: 100,
      align: 'center',
      x: 20,
      y: 20,
    },
    webfont: {
      google: {
        families: ['Acme'],
      },
    },
  },
  cloudMemeHashes: {},
  fontFamilies: [],
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [vuexLocal.plugin],
});
