<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <slot :on="on"></slot>
    </template>
    <v-list subheader>
      <v-subheader>Preset items</v-subheader>
      <v-list-tile
        v-for="(preset, key) in presets"
        :key="key"
        :to="{ name: 'preset', params: { preset: key }, query: $route.query }"
        avatar
      >
        <v-list-tile-avatar tile size="56">
          <v-img :src="preset.bgr.url" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="preset.name" />
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    presets: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activator: null,
    };
  },
};
</script>
