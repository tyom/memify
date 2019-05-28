<template>
  <v-layout justify-center>
    <v-flex lg8 pa-4>
      <h1 class="mb-4 text-xs-center">
        Create a new meme
      </h1>
      <v-card>
        <Meme :meme="meme" @update="handleUpdate" />
      </v-card>
      <v-flex
        text-xs-center
        my-3
        v-if="meme.image.src && meme.title"
      >
        <v-btn
          large
          color="primary"
          @click="handleCreate"
        >
          Create
        </v-btn>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import { merge } from 'lodash';
import Meme from '../components/Meme/Meme';

export default {
  components: {
    Meme,
  },
  computed: {
    meme() {
      return merge({}, this.$store.state.newMeme, {
        caption: {
          text: this.$route.query.text,
        },
      });
    },
  },
  methods: {
    async handleUpdate(updatedMeme) {
      await this.$store.dispatch('UPDATE_NEW_MEME', updatedMeme);
    },
    async handleCreate() {
      await this.$store.dispatch('SAVE_TO_CLOUD', this.meme);
    },
  },
};
</script>
