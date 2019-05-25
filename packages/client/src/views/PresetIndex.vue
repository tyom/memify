<template>
  <v-container
    grid-list-lg
    fluid
    v-if="preset"
  >
    <h1>Preset: {{ preset.title }}</h1>
    <v-layout row wrap>
      <v-flex
        v-for="meme in memes"
        :key="meme.id"
        xs4
      >
        <v-card
          flat
          tile
          hover
          :to="{
            name: 'preset-meme',
            params: { presetId, memeId: meme.id },
            query: $route.query,
          }"
        >
          <v-img :src="meme.image.src" height="250px" />
          <v-container
            fill-height
            fluid
            pa-2
          >
            {{ meme.title }}
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { db } from '@memify/shared';

export default {
  data() {
    return {
      preset: null,
    };
  },
  computed: {
    presetId() {
      return this.$route.params.presetId;
    },
    memes() {
      return this.$store.state.preset.memes;
    },
  },
  watch: {
    presetId: {
      immediate: true,
      handler(id) {
        return this.$bind('preset', db.collection('presets').doc(id));
      },
    },
  },
};
</script>
