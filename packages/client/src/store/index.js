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
    caption: {
      fill: '#fff',
    }
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
