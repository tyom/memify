<template>
  <v-layout align-center>
    <v-flex d-flex fill-height>
      <v-layout column v-if="meme">
        <Toolbar
          :meme="meme"
          :has-changed="hasChanged"
          @render="$store.dispatch('RENDER', meme)"
          @restore="$store.dispatch('RESTORE_FROM_CLOUD', meme.id)"
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
import { omit, merge } from 'lodash';
import hash from 'object-hash';
import Toolbar from '../components/Meme/Toolbar';
import Stage from '../components/Meme/Stage';

export default {
  components: {
    Toolbar,
    Stage,
  },
  computed: {
    memeId() {
      return this.$route.params.memeId;
    },
    meme() {
      if (!this.$store.state.meme) {
        return;
      }
      return merge({}, this.$store.state.meme, {
        caption: {
          text: this.$route.query.text,
        },
      });
    },
    hasChanged() {
      if (this.meme.id !== this.memeId) {
        return false;
      }
      const currentHash = hash(omit(this.meme, 'caption.text'));
      const cloudHash = this.$store.state.cloudMemeHashes[this.memeId];
      return currentHash !== cloudHash;
    },
  },
  watch: {
    memeId: {
      immediate: true,
      handler(id) {
        return this.$store.dispatch('INIT_MEME', id);
      },
    },
  },
  methods: {
    handleUpdateCaption(captionAttrs = {}) {
      let updatedMeme = {
        ...this.meme,
        id: this.memeId,
        caption: {
          ...this.meme.caption,
          ...captionAttrs,
        },
        webfont: {
          ...this.meme.webfont,
          google: {
            families: [captionAttrs.fontFamily],
          }
        }
      };

      return this.$store.dispatch('UPDATE_MEME', updatedMeme);
    },
  },
};
</script>
