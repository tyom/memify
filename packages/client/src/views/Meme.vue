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
import { isEqual, omit } from 'lodash';
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
      if (!this.$store.state.preset && this.cloudMeme) {
        return this.cloudMeme;
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
      if (!this.cloudMeme) {
        return false;
      }
      return !isEqual(
        omit(this.cloudMeme, 'caption.text'),
        omit(this.meme, 'caption.text')
      );
    },
  },
  watch: {
    memeId: {
      immediate: true,
      handler(id) {
        return this.$bind('cloudMeme', db.collection('memes').doc(id));
      },
    },
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
