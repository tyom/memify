import to from 'await-to-js';
import router from '../router';

export default {
  async FETCH_PRESETS({ commit }, presetsUrl) {
    const presetRequest = fetch(presetsUrl).then(res => res.json());
    const [err, storedPreset] = await to(presetRequest);
    if (err) {
      throw new Error(`Error getting preset from URL ${presetsUrl}`);
    }
    commit('setPresets', storedPreset);
  },

  SELECT_PRESET({ commit, state }, presetKey) {
    if (!state.presets || !presetKey) {
      return;
    }
    commit('setSelectedPreset', {
      key: presetKey,
      content: state.presets[presetKey],
    });
  },

  UPDATE_PRESET({ commit, state }, preset) {
    commit('setSelectedPreset', preset);
    commit('setPresets', {
      ...state.presets,
      [preset.key]: preset.content,
    });
  },

  UPDATE_CAPTION(context, caption) {
    const { params, query } = router.currentRoute;

    router.replace({
      name: 'preset',
      params: { preset: params.preset },
      query: {
        ...query,
        text: caption,
      },
    });
  },

  UPDATE_TEXT_OPTIONS({ commit, state }, textOptions) {
    commit('setSelectedPreset', {
      ...state.selectedPreset,
      content: {
        ...state.selectedPreset.content,
        text: {
          ...state.selectedPreset.content.text,
          ...textOptions,
        },
      },
    });
  },

  UPDATE_FONT_FAMILY({ dispatch, state }, fontFamily) {
    const preset = state.selectedPreset.content;
    const key = state.selectedPreset.key;
    const updatedPreset = {
      ...preset,
      text: {
        ...preset.text,
        fontFamily,
      },
      webfont: {
        ...preset.webfont,
        google: {
          ...preset.webfont.google,
          families: [fontFamily],
        },
      },
    };
    dispatch('UPDATE_PRESET', { key, content: updatedPreset });
  },

  async GET_GOOGLE_FONTS({ commit }) {
    const fontsRequest = fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC7QqYhyTro_5d8ji_cbP-DCJYdugHBuss'
    ).then(res => res.json());
    const [err, fontsData] = await to(fontsRequest);
    if (err) {
      throw new Error('Failed to get Google Fonts list');
    }
    const fontFamilies = fontsData.items.map(({ family }) => ({
      text: family,
      value: family,
    }));
    commit('setFontFamilies', fontFamilies);
  },
};
