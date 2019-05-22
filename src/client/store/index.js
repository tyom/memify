import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import actions from './actions';
import mutations from './mutations';

export const state = {
  presets: undefined,
  selectedPreset: undefined,
  fontFamilies: [],
};

export default function(storeName) {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    plugins: [
      createPersistedState({
        key: storeName,
      }),
    ],
  });
}
