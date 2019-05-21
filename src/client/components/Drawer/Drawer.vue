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
          <v-list-tile-title>Loaded presets</v-list-tile-title>
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

      <PresetItems :presets="presets" :mini="mini" />

      <Actions
        @export="handleExport"
        :expanded="!mini"
        class="mt-auto"
      />
    </v-layout>
    <v-dialog
      v-model="exportDialog"
      scrollable
      max-width="80vw"
    >
      <v-card>
        <v-card-title>
          <h2 class="headline">
            Export preset as JSON
          </h2>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <pre>{{ JSON.stringify(presets, null, 2) }}</pre>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>
</template>

<script>
import Actions from './Actions';
import PresetItems from './PresetItems';

export default {
  components: {
    Actions,
    PresetItems,
  },
  props: {
    presets: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      mini: true,
      exportDialog: false,
    };
  },
  methods: {
    handleExport() {
      this.exportDialog = true;
    },
  },
};
</script>

<style>
.preset-drawer .v-icon {
  margin: auto;
}
</style>
