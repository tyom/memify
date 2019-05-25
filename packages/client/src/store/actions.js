import to from 'await-to-js';
import db from './firestore';
import router from '../router';

const GOOGLE_API_KEY = process.env.VUE_APP_GOOGLE_API_KEY;

async function getPresetMemesFromCloud(presetDoc) {
  const { memes } = presetDoc.data();
  const refPromises = memes.map(id => db.doc(`memes/${id}`).get());
  const presetMemeDocs = await Promise.all(refPromises);
  return presetMemeDocs.map(d => ({
    ...d.data(),
    id: d.id,
  }));
}

export default {
  async INIT_APP({ state, dispatch }) {
    if (!state.fontFamilies) {
      dispatch('GET_GOOGLE_FONTS');
    }
  },

  async INIT_PRESET({ commit, state }, presetId) {
    if (state.preset) {
      return;
    }

    const cloudPresetDoc = await db
      .collection('presets')
      .doc(presetId)
      .get();

    if (!cloudPresetDoc.exists) {
      throw new Error(`Couldn't find preset: ${presetId}`);
    }

    const memes = await getPresetMemesFromCloud(cloudPresetDoc);
    commit('setPreset', {
      id: presetId,
      memes,
    });
  },

  RENDER() {
    const currentHref = router.resolve(router.currentRoute).href;
    window.location.href = currentHref.replace('#', '/r');
  },

  SAVE_TO_CLOUD(context, meme) {
    const updatedMeme = {
      ...meme,
      caption: {
        ...meme.caption,
        text: '',
      },
    };
    db.collection('memes')
      .doc(meme.id)
      .set(updatedMeme);
  },

  UPDATE_MEME({ commit, state }, newMeme) {
    const { params, query } = router.currentRoute;
    const updatedMemes = state.preset.memes.map(meme =>
      meme.id === newMeme.id ? newMeme : meme
    );

    router.replace({
      name: params.presetId ? 'preset-meme' : 'meme',
      params,
      query: {
        ...query,
        text: newMeme.caption.text,
      },
    });

    commit('setPreset', {
      ...state.preset,
      memes: updatedMemes,
    });
  },

  async GET_GOOGLE_FONTS({ commit }) {
    const fontsRequest = fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_API_KEY}`
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
