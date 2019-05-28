import to from 'await-to-js';
import { get, omit } from 'lodash';
import hash from 'object-hash';
import { Base64 } from 'js-base64';
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
  return {
    id: cloudPresetDoc.id,
    ...cloudPresetDoc.data(),
  };
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
    const { params, query } = router.currentRoute;
    const localPresetMemes = get(state.preset, 'memes', []);
    const localMeme = params.presetId
      ? localPresetMemes.find(m => m.id === memeId)
      : state.memes[memeId];

    if (memeId === 'snapshot' && query.d) {
      try {
        const snapshotMeme = JSON.parse(Base64.decode(query.d));
        commit('setSnapshotMemeId', snapshotMeme.id);
        return commit('setMeme', snapshotMeme);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse snapshot');
      }
    } else {
      commit('setSnapshotMemeId', undefined);
    }

    const cloudMeme = await getDocumentFromCloud('memes', memeId);
    const cloudMemeHash = hash(omit(cloudMeme, 'caption.text'));

    commit('setMeme', localMeme || cloudMeme);
    commit('setCloudMemeHash', { memeId, hash: cloudMemeHash });
  },

  UPDATE_MEME({ commit, dispatch }, updatedMeme) {
    const { params } = router.currentRoute;

    commit('setMeme', updatedMeme);

    if (params.presetId) {
      dispatch('UPDATE_MEME_IN_PRESET', {
        presetId: params.presetId,
        updatedMeme,
      });
    }
  },

  UPDATE_CAPTION_TEXT(context, text) {
    const { params, query } = router.currentRoute;

    router.replace({
      name: params.presetId ? 'preset-meme' : 'meme',
      params,
      query: {
        ...query,
        text,
      },
    });
  },

  UPDATE_NEW_MEME({ commit }, updatedMeme) {
    const { query } = router.currentRoute;
    // update URL
    router.replace({
      name: 'new',
      query: {
        ...query,
        text: updatedMeme.caption.text,
      },
    });

    commit('setNewMeme', updatedMeme);
  },

  UPDATE_MEME_IN_PRESET({ commit, state }, { presetId, updatedMeme }) {
    if (!presetId || !state.preset) {
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

  RENDER(context, meme) {
    const memeSnapshot = {
      ...meme,
      caption: {
        ...meme.caption,
        text: router.currentRoute.query.text,
      },
    };
    const snapshotBase64 = Base64.encodeURI(JSON.stringify(memeSnapshot));

    window.location.href = `/r/snapshot?d=${snapshotBase64}`;
  },

  async SAVE_TO_CLOUD({ commit }, meme) {
    const { query } = router.currentRoute;
    const updatedMeme = {
      ...meme,
      caption: {
        ...meme.caption,
        text: '',
      },
    };

    let record;
    if (!updatedMeme.id) {
      record = await db.collection('memes').add(updatedMeme);
    } else {
      await db
        .collection('memes')
        .doc(meme.id)
        .set(updatedMeme);
    }

    const updatedMemeMemeHash = hash(omit(updatedMeme, 'caption.text'));
    commit('setCloudMemeHash', { memeId: meme.id, hash: updatedMemeMemeHash });

    if (record) {
      router.push({ name: 'meme', params: { memeId: record.id }, query });
    }
  },

  async RESTORE_FROM_CLOUD({ commit, dispatch }, memeId) {
    const { params } = router.currentRoute;

    if (!memeId) {
      throw new Error('Meme ID is missing');
    }
    const cloudMeme = await getDocumentFromCloud('memes', memeId);

    commit('setMeme', cloudMeme);

    if (params.presetId) {
      dispatch('UPDATE_MEME_IN_PRESET', {
        presetId: params.presetId,
        updatedMeme: cloudMeme,
      });
    }
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
