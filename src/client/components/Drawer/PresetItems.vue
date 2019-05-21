<template>
  <v-list class="presets pt-0">
    <v-list-tile
      avatar
      v-for="item in presetItems"
      :key="item.title"
      :to="{
        name: 'preset',
        params: { preset: item.key },
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
            <v-img :src="item.thumbUrl" />
          </v-list-tile-avatar>
        </template>
        <span>{{ item.title }}</span>
      </v-tooltip>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    presets: {
      type: Object,
      default: () => ({}),
    },
    mini: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    presetItems() {
      return Object.entries(this.presets).map(([key, content]) => ({
        key,
        title: content.name,
        thumbUrl: content.bgr.url,
      }));
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
