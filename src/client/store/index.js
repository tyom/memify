import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const state = {
  preset: undefined,
  fontFamilies: [],
};

export default function(storeName) {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    plugins: [
      createPersistedState({
        key: storeName,
      }),
    ],
  });
}
