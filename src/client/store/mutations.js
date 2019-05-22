export default {
  setPresets(state, presets) {
    state.presets = presets;
  },

  setSelectedPreset(state, preset) {
    state.selectedPreset = preset;
    state.presets = {
      ...state.presets,
      [preset.key]: preset.content,
    }
  },

  setFontFamilies(state, fontFamilies) {
    state.fontFamilies = fontFamilies;
  }
};
