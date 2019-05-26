<template>
  <v-layout align-center>
    <v-flex d-flex fill-height>
      <v-layout column v-if="meme">
        <Toolbar
          :meme="meme"
          :has-changed="hasChanged"
          @render="$store.dispatch('RENDER', meme)"
          @save="$store.dispatch('SAVE_TO_CLOUD', meme)"
          @update:caption="handleUpdateCaption"
        />
        <v-flex
          d-flex
          pa-3
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
import { isEqual, omit, merge } from 'lodash';
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
      const localMeme = this.$store.state.meme || {};

      if (localMeme.id === this.memeId) {
        return merge({}, localMeme, {
          caption: {
            text: this.captionText,
          },
        });
      }

      if (this.cloudMeme) {
        return merge({}, this.cloudMeme, {
          caption: {
            text: this.captionText,
          },
        });
      }

      return null;
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
    meme(meme) {
      return this.$store.dispatch('INIT_MEME', meme);
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
