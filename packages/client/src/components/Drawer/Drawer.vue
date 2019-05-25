<template>
  <v-navigation-drawer
    :mini-variant="mini"
    class="preset-drawer"
    permanent
    dark
  >
    <v-layout column fill-height>
      <v-list class="pa-1">
        <v-list-tile>
          <v-list-tile-title>Preset items</v-list-tile-title>
          <v-list-tile-action>
            <v-btn
              icon
              small
              @click.stop="mini = !mini"
              :class="{ 'ml-auto': !mini }"
            >
              <v-icon>{{ mini ? 'chevron_right' : 'chevron_left' }}</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <PresetItems :memes="preset.memes" :mini="mini" />
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import PresetItems from './PresetItems';

export default {
  components: {
    PresetItems,
  },
  props: {
    preset: {
      type: Object,
      default: () => ({
        memes: [],
      }),
    }
  },
  data() {
    return {
      mini: true,
    };
  },
};
</script>

<style>
.preset-drawer .v-icon {
  margin: auto;
}
</style>
