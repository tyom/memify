export default {
  setPreset(state, preset) {
    state.preset = preset;
  },

  setMeme(state, meme) {
    state.meme = meme;
  },

  setCloudMemeHash(state, { memeId, hash }) {
    state.cloudMemeHashes[memeId] = hash;
  },

  setFontFamilies(state, fontFamilies) {
    state.fontFamilies = fontFamilies;
  }
};
