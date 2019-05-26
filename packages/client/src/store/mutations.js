export default {
  setPreset(state, preset) {
    state.preset = preset;
  },

  setMeme(state, meme) {
    state.memes[meme.id] = meme;
  },

  setSnapshotMemeId(state, memeId) {
    state.snapshotId = memeId;
  },

  setCloudMemeHash(state, { memeId, hash }) {
    state.cloudMemeHashes[memeId] = hash;
  },

  setFontFamilies(state, fontFamilies) {
    state.fontFamilies = fontFamilies;
  }
};
