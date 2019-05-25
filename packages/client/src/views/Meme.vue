<template>
  <v-layout align-center>
    <v-flex d-flex fill-height>
      <v-layout column>
        <Toolbar
          :meme="meme"
          :has-changed="hasChanged"
          @render="$store.dispatch('RENDER', meme)"
          @save="$store.dispatch('SAVE_TO_CLOUD', meme)"
          @update:caption="handleUpdateCaption"
        />
        <v-flex
          d-flex
          align-center
          align-self-center
        >
          <Stage :meme="meme" @update:caption="handleUpdateCaption" />
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { isEqual } from 'lodash';
import db from '../store/firestore';
import Toolbar from '../components/Meme/Toolbar';
import Stage from '../components/Meme/Stage';

export default {
  components: {
    Toolbar,
    Stage,
  },
  data() {
    return {
      cloudMeme: null,
    };
  },
  computed: {
    memeId() {
      return this.$route.params.memeId;
    },
    captionText() {
      return this.$route.query.text;
    },
    meme() {
      if (!this.$store.state.preset) {
        return;
      }
      const localMeme =
        this.$store.state.preset.memes.find(m => m.id === this.memeId) || {};
      return {
        ...localMeme,
        caption: {
          ...localMeme.caption,
          text: this.captionText,
        },
      };
    },
    hasChanged() {
      return this.cloudMeme && !isEqual(this.cloudMeme, this.meme);
    },
  },
  firestore() {
    return {
      cloudMeme: db.collection('memes').doc(this.memeId),
    };
  },
  methods: {
    handleUpdateCaption(captionAttrs) {
      const updatedMeme = {
        id: this.memeId,
        ...this.meme,
        caption: {
          ...this.meme.caption,
          ...captionAttrs,
        },
      };

      if (captionAttrs.fontFamily) {
        updatedMeme.webfont = {
          ...updatedMeme.webfont,
          google: {
            families: [captionAttrs.fontFamily],
          },
        };
      }
      return this.$store.dispatch('UPDATE_MEME', updatedMeme);
    },
  },
};
</script>
