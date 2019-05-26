import to from 'await-to-js';
import { get, omit } from 'lodash';
import hash from 'object-hash';
import db from '../store/firestore';
import router from '../router';

const GOOGLE_API_KEY = process.env.VUE_APP_GOOGLE_API_KEY;
const GOOGLE_FONTS_ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_API_KEY}`;

async function getAllDocumentsFromCloudByIds(collectionName, ids = []) {
  const refPromises = ids.map(id => db.doc(`${collectionName}/${id}`).get());
  const collectionDocs = await Promise.all(refPromises);
  return collectionDocs.map(d => ({
    ...d.data(),
    id: d.id,
  }));
}

async function getDocumentFromCloud(collectionName, itemId) {
  const cloudPresetDoc = await db
    .collection(collectionName)
    .doc(itemId)
    .get();

  if (!cloudPresetDoc.exists) {
    throw new Error(`Couldn't locate ${itemId} in ${collectionName}`);
  }
  return cloudPresetDoc.data();
}

export default {
  async INIT_APP({ state, dispatch }) {
    if (!state.fontFamilies.length) {
      dispatch('GET_GOOGLE_FONTS');
    }
  },

  async INIT_PRESET({ commit, state }, presetId) {
    if (state.preset && state.preset.id === presetId) {
      return;
    }

    const cloudPreset = await getDocumentFromCloud('presets', presetId);
    const cloudPresetMemes = await getAllDocumentsFromCloudByIds(
      'memes',
      cloudPreset.memes
    );
    commit('setPreset', {
      id: presetId,
      title: cloudPreset.title,
      memes: cloudPresetMemes,
    });
  },

  async INIT_MEME({ commit, state }, memeId) {
    const localPresetMemes = get(state.preset, 'memes', []);
    const localMeme = localPresetMemes.find(m => m.id === memeId);

    if (localMeme) {
      return commit('setMeme', localMeme);
    }

    const cloudMeme = await getDocumentFromCloud('memes', memeId);
    const cloudMemeHash = hash(omit(cloudMeme, 'caption.text'));

    commit('setCloudMemeHash', { memeId, hash: cloudMemeHash });
    commit('setMeme', cloudMeme);
  },

  UPDATE_MEME({ commit, dispatch }, updatedMeme) {
    const { params, query } = router.currentRoute;

    // update URL
    router.replace({
      name: params.presetId ? 'preset-meme' : 'meme',
      params,
      query: {
        ...query,
        text: updatedMeme.caption.text,
      },
    });

    commit('setMeme', updatedMeme);
    dispatch('UPDATE_MEME_IN_PRESET', {
      presetId: params.presetId,
      updatedMeme,
    });
  },

  UPDATE_MEME_IN_PRESET({ commit, state }, { presetId, updatedMeme }) {
    if (!presetId) {
      return;
    }
    const presetMemesWithUpdate = state.preset.memes.map(meme =>
      meme.id === updatedMeme.id ? updatedMeme : meme
    );
    commit('setPreset', {
      ...state.preset,
      memes: presetMemesWithUpdate,
    });
  },

  RENDER() {
    const { memeId } = router.currentRoute.params;
    const { text = '' } = router.currentRoute.query;

    window.location.href = `/r/${memeId}?text=${encodeURIComponent(text)}`;
  },

  SAVE_TO_CLOUD({ commit }, meme) {
    if (!meme.id) {
      throw new Error('Meme ID is missing');
    }
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

    const updatedMemeMemeHash = hash(omit(updatedMeme, 'caption.text'));
    commit('setCloudMemeHash', { memeId: meme.id, hash: updatedMemeMemeHash });
  },

  async GET_GOOGLE_FONTS({ commit }) {
    const fontsRequest = fetch(GOOGLE_FONTS_ENDPOINT).then(res => res.json());
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
