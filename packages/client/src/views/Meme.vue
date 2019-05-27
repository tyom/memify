<template>
  <v-layout align-center>
    <v-flex d-flex fill-height>
      <Meme
        v-if="meme"
        :meme="meme"
        :caption-text="captionText"
        :has-changed="hasChanged"
        @render="$store.dispatch('RENDER', meme)"
        @restore="$store.dispatch('RESTORE_FROM_CLOUD', meme.id)"
        @save="$store.dispatch('SAVE_TO_CLOUD', meme)"
        @update:caption="handleUpdateCaption"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { omit, merge } from 'lodash';
import hash from 'object-hash';
import Meme from '../components/Meme/Meme';

export default {
  components: {
    Meme,
  },
  data() {
    return {
      meme: undefined,
    };
  },
  computed: {
    memeId() {
      return this.$route.params.memeId;
    },
    captionText() {
      return this.$route.query.text;
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
      async handler(memeId) {
        await this.$store.dispatch('INIT_MEME', memeId);
        const id = this.$store.state.snapshotId || this.$route.params.memeId;
        const currentMeme = this.$store.state.memes[id];
        this.handleUpdateMeme(currentMeme);
      },
    },
    '$store.state.memes': {
      deep: true,
      handler(memes) {
        this.handleUpdateMeme(memes[this.memeId]);
      },
    },
  },
  methods: {
    async handleUpdateMeme(updatedMeme) {
      if (!updatedMeme) {
        return;
      }
      this.meme = merge({}, updatedMeme, {
        caption: {
          text: this.captionText,
        },
      });
    },
    async handleUpdateCaption(updatedMeme) {
      await this.$store.dispatch('UPDATE_MEME', updatedMeme);
      this.handleUpdateMeme(updatedMeme);
    },
  },
};
</script>
