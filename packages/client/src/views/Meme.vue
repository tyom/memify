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
      }
    }
  },
  methods: {
    handleUpdateMeme(meme) {
      if (!meme) {
        return;
      }
      this.meme = merge({}, meme, {
        caption: {
          text: this.captionText,
        },
      });
    },
    async handleUpdateCaption(captionAttrs = {}) {
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
          },
        },
      };

      await this.$store.dispatch('UPDATE_MEME', updatedMeme);
      this.handleUpdateMeme(updatedMeme);
    },
  },
};
</script>
