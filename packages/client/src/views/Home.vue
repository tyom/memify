<template>
  <v-layout justify-center>
    <v-flex
      sm11
      py-5
      px-2
    >
      <h1 class="mb-2">
        Create a new meme
      </h1>

      <v-card>
        <Meme :meme="blankMeme" @update:caption="handleUpdateCaption" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Meme from '../components/Meme/Meme';

export default {
  components: {
    Meme,
  },
  computed: {
    blankMeme() {
      return this.$store.state.newMeme;
    },
  },
  methods: {
    async handleUpdateCaption(updatedMeme) {
      await this.$store.dispatch('UPDATE_NEW_MEME', updatedMeme);
      // await this.$store.dispatch('UPDATE_MEME', updatedMeme);
      // this.blankMeme = updatedMeme;
    },
  },
};
</script>
