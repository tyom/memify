<template>
  <v-list class="presets pt-0">
    <v-list-tile
      avatar
      v-for="meme in memes"
      :key="meme.title"
      :to="{
        name: 'preset-meme',
        params: { presetId: presetId, memeId: meme.id },
        query: $route.query,
      }"
    >
      <v-tooltip right :disabled="!mini">
        <template v-slot:activator="{ on }">
          <v-list-tile-avatar
            v-on="on"
            tile
            size="55"
          >
            <v-img :src="meme.image.src" />
          </v-list-tile-avatar>
        </template>
        <span>{{ meme.title }}</span>
      </v-tooltip>
      <v-list-tile-content>
        <v-list-tile-title>{{ meme.title }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    memes: {
      type: Array,
      default: () => [],
    },
    mini: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    presetId() {
      return this.$route.params.presetId;
    },
  },
};
</script>

<style>
.presets .v-list__tile.v-list__tile--avatar {
  height: 70px;
}

.preset-drawer .v-list__tile__content {
  padding-left: 16px;
}

.presets .primary--text.v-list__tile--active {
  background-color: #000a !important;
  color: #fff !important;
}

.presets .v-list__tile--active .v-image {
  box-shadow: 0 0 0 1px #fff6;
}
</style>
